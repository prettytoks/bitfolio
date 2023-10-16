import { useEffect, useState } from 'react';
import axios from 'axios';
import './../index.css';
import {  Link } from 'react-router-dom';
import Pagination from './Pagination';

export interface CoinData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    market_cap: number;
    price_change_percentage_24h: number;
  };

  interface CoinsProps {
    isDarkMode: boolean;
  }

  const Coins: React.FC<CoinsProps> = ({ isDarkMode }) => {
  
    const [coinData, setCoinData] = useState<any[]>([]);
    const [globalData, setGlobalData] = useState<any>(null);
   // const [isLoading, setIsLoading] = useState(true);

    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [coinsPerPage] = useState(50);

    useEffect(() => {
    const fetchGlobalData = async () => {
      const cachedGlobalData = localStorage.getItem('globalData');
      if (cachedGlobalData) {
        setGlobalData(JSON.parse(cachedGlobalData));
      } else {
        try {
        const response = await axios.get('https://api.coingecko.com/api/v3/global');
        setGlobalData(response.data.data);
        localStorage.setItem('globalData', JSON.stringify(response.data.data));
        } catch (error) {
        console.log('Failed to fetch global data from the API:', error);
        //setIsLoading(false);
        }
      }
    };

    fetchGlobalData();
    }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
        // Check if cached coin data exists in localStorage
        const cachedCoinData = localStorage.getItem('coinData');
        if (cachedCoinData) {
          setCoinData(JSON.parse(cachedCoinData));
        } else {
          try {
            const response = await axios.get(
              'https://api.coingecko.com/api/v3/coins/markets',
              {
                params: {
                  vs_currency: 'usd',
                  order: 'market_cap_desc',
                  per_page: 50,
                  page: 1,
                  sparkline: true,
                  price_change_percentage: '1h,24h,7d,14d,30d,200d,1y',
                },
              }
            );
  
            setCoinData(response.data);
            // Cache the coin data in localStorage
            localStorage.setItem('coinData', JSON.stringify(response.data));
          } catch (error) {
            console.error('Failed to fetch coin data from the API:', error);
          }
        }
      };

    fetchCoinData();
  }, [coinData]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const filteredCoins = coinData.filter((coin) => coin.name.toLowerCase().includes(searchInput.toLowerCase()));
  const totalFilteredCoins = filteredCoins.length;

  const indexOfLastCoin = currentPage * coinsPerPage;
  const indexOfFirstCoin = indexOfLastCoin - coinsPerPage;
  const currentCoins = filteredCoins.slice(indexOfFirstCoin, indexOfLastCoin);


  function numberWithCommas(x: number | undefined) {
    if (!x) return "";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

return(
    <>

        <div className={`coins ${isDarkMode ? 'dark' : ''}`}>
          <div className="container mx-auto py-24 px-10">
            <h1 className="text-4xl font-bold mb-8 text-center">Crypto Tracker</h1>

            <h2 className='text-2xl font-bold mb-4'>Global Data</h2>

            <div className="overflow-x-auto">

              <div className="flex mb-8">
                  <div className="mr-5">

                      <p className="text-blue-500 text-sm dark:text-white dark:text-blue-200">Coins:</p>
                      <p className="text-sm">{globalData?.active_cryptocurrencies}</p>
                  </div>

                  <div className="mr-5">
                    <p className="text-blue-500 text-sm dark:text-white dark:text-blue-200">Exchanges:</p>
                    <p className="text-sm">{globalData?.markets}</p>
                  </div>

                  <div className="mr-5">
                    <p className="text-blue-500 text-sm dark:text-white dark:text-blue-200">Market Cap:</p>
                    <p className="text-sm">
                    ${numberWithCommas(globalData?.total_market_cap?.usd)}
                    <span className={globalData?.market_cap_change_percentage_24h_usd < 0 ? "text-red-500 ml-3" : "text-green-500 ml-3"}>
                    {globalData?.market_cap_change_percentage_24h_usd.toFixed(2)}%
                    </span>
                    </p>
                  </div>

                <div className="mr-5">
                  <p className="text-blue-500 text-sm dark:text-white dark:text-blue-200">24h Vol:</p>
                  <p className="text-sm">${numberWithCommas(globalData?.total_volume?.usd)}</p>
                </div>

                <div>
                  <p className="text-blue-500 text-sm dark:text-white dark:text-blue-200">Dominance:</p>
                  <span className="text-sm mr-3">BTC {globalData?.market_cap_percentage?.btc.toFixed(1)}%</span>
                  <span className="text-sm">ETH {globalData?.market_cap_percentage?.eth.toFixed(1)}%</span>
                </div>
                
              </div>

            </div>

            <input
              type="text"
              placeholder="Search"
              value={searchInput}
              onChange={handleSearchInputChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-5 mb-5 dark:text-black"
            />
    
            <div className="overflow-x-auto">

              <h2 className="text-2xl font-semibold mt-8 mb-5">Top Cryptocurrencies</h2>

              <table className="table-auto w-full">
                  <thead>
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Symbol</th>
                        <th className="px-4 py-2 text-left">Price (USD)</th>
                        <th className="px-4 py-2 text-left">Market Cap</th>
                        <th className="px-4 py-2 text-left">Change (24h)</th>
                    </tr>
                  </thead>

                  <tbody className='text-sm'>
                    {currentCoins.length === 0 ? (
                      <tr>
                        <td colSpan={5}>No coins found.</td>
                      </tr>
                    ) : (
                    currentCoins.map((coin) => (
                    <tr key={coin.id} className='odd:bg-white even:bg-slate-50 dark:bg-gray-800' >
                      <td className="px-4 py-2">
                      <Link to={`/${coin.id}`} className="text-blue-500 hover:text-blue-800 dark:text-white dark:hover:text-blue-300">
                      
                          <img src={coin.image} alt={coin.name} className="w-6 h-6 inline-block mr-2" />
                          {coin.name}

                      </Link>
                      </td>

                      <td className="px-4 py-2">{coin.symbol.toUpperCase()}</td>

                      <td className="px-4 py-2">${coin.current_price.toFixed(2)}</td>

                      <td className="px-4 py-2">${coin.market_cap.toLocaleString()}</td>

                      <td className={coin.price_change_percentage_24h > 0 ? 'px-4 py-2 text-green-500' : 'px-4 py-2 text-red-500'}>
                          {coin.price_change_percentage_24h.toFixed(2)}%
                      </td>
                    </tr>
                    ))
                  
                  )}
          
                  </tbody>

              </table>

            </div>

            <Pagination
              currentPage={currentPage}
              coinsPerPage={coinsPerPage}
              totalCoins={totalFilteredCoins}
              onPageChange={setCurrentPage}
            />
          
            {filteredCoins.length === 0 ? (
              <p className='py-5'>No coins found.</p>
            ) : (
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
              
                <p className='py-5 text-sm text-gray-700 dark:text-white'>{`Showing ${currentCoins.length} of ${totalFilteredCoins} results.`}</p>
              </div>
            )}

          </div>

        </div>

    </>
    );
  }

  export default Coins;