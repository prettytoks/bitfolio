import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';

interface CoinDetailsProps {
  isDarkMode: boolean;
}

const CoinDetails: React.FC<CoinDetailsProps> = ({ isDarkMode }) => {
  const { id } = useParams<{ id: string }>();
  const [coinDetails, setCoinDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoinDetails = async () => {
    // Check if the data is available in localStorage
    const cachedData = localStorage.getItem(id ?? '');
    if (cachedData) {
      setCoinDetails(JSON.parse(cachedData));
      setIsLoading(false);
    } else {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoinDetails(response.data);
        localStorage.setItem(id ?? '', JSON.stringify(response.data));
        setIsLoading(false);
      } catch (error) {
        console.log('Failed to fetch coin details from the API:', error);
        setIsLoading(false);
      }
    };
  }

    fetchCoinDetails();
  }, [id]);

  /*
  useEffect(() => {
    if (coinDetails) {
      localStorage.setItem(id ?? '', JSON.stringify(coinDetails));
    }
  }, [coinDetails, id]);
*/

  // Render loading state if data is still loading
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!coinDetails) {
    return <p>Failed to fetch coin details.</p>;
  }

  return (
    <>
        <div className={`coins ${isDarkMode ? 'dark' : ''}`}>

            <div className="container mx-auto py-24 px-10">

              <h1 className="text-2xl font-bold mb-4"> {coinDetails.name} ({coinDetails.symbol.toUpperCase()})</h1>
            
              <div className="flex items-center mb-5">

                  <img src={coinDetails.image.small} alt={coinDetails.name} className='mr-2'/>

                  <p>{coinDetails.symbol.toUpperCase()}/USD</p>
              </div>
          
              <p dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(coinDetails.description ? coinDetails.description.en : ''),
              }}>

              </p>

              <h2 className="text-xl font-semibold mt-5 mb-2">Market Data</h2>

              <span className='text-blue-500 dark:text-blue-200'>Current Price (USD): </span> <span>${coinDetails.market_data?.current_price?.usd.toFixed(2)}</span>

              <div>
                <span className='text-blue-500 dark:text-blue-200'>Market Cap (USD): </span>
                <span>${coinDetails.market_data.market_cap.usd.toLocaleString()}</span>

              </div>

                <span className='text-blue-500 dark:text-blue-200'>Change (24h): </span>

                <span className={coinDetails.market_data.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                      {coinDetails.market_data.price_change_percentage_24h.toFixed(2)}%
                </span>

            
            </div>

      </div>
           
    </>
  );
}

export default CoinDetails;


