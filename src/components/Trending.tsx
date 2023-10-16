import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface TrendingProps {
    isDarkMode: boolean;
  }

const Trending: React.FC<TrendingProps> = ({ isDarkMode }) => {

    const [trendingData, setTrendingData] = useState<any[]>([]);
    const [latestNews, setLatestNews] = useState<string[]>([]);

    useEffect(() => {
        const fetchTrendingData = async () => {
          // Check if cached trending data exists in localStorage
          const cachedTrendingData = localStorage.getItem('trendingData');
          if (cachedTrendingData) {
            setTrendingData(JSON.parse(cachedTrendingData));
          } else {
            try {
              const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
              setTrendingData(response.data.coins);
              
              // Cache the trending data in localStorage
              localStorage.setItem('trendingData', JSON.stringify(response.data.coins));
            } catch (error) {
              console.error('Failed to fetch trending data from the API:', error);
            }
          }
        };
      
        fetchTrendingData();
      }, []);
      
      function formatDate(timestamp: number): string {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }

      function truncateDescription(description: string, maxLength: number): string {
        if (description.length > maxLength) {
          return description.substr(0, maxLength) + '...';
        }
        return description;
      }

      useEffect(() => {
        const fetchLatestNews = async () => {
          const cachedLatestNews = localStorage.getItem('latestNews');
   
            if (cachedLatestNews) {
              const parsedData = JSON.parse(cachedLatestNews);
              setLatestNews(parsedData.data);
            } else {
           
          try {
            const response = await axios.get('https://api.coingecko.com/api/v3/news');
    
            const headlines = response.data.data.map((item: any) => {

                const timestamp = item.updated_at * 1000; // Convert timestamp to milliseconds
                //const date = new Date(timestamp);
                const formattedDate = formatDate(timestamp);
            
                let description = truncateDescription(item.description, 150);
              
                return {
                  title: item.title,
                  description: description,
                  date: formattedDate,
                  image: item.thumb_2x,
                };
              });
              
    
            setLatestNews(headlines);
            localStorage.setItem('latestNews', JSON.stringify(response.data));
          } catch (error) {
            console.error('Failed to fetch latest news from the API:', error);
          }
        }
        };
    
        fetchLatestNews();
      }, []);


  return (
    <>
    
        <div className={`coins ${isDarkMode ? 'dark' : ''}`}>

          <div className="container mx-auto py-24 px-10">

            <h2 className="text-2xl font-semibold mb-4">Top Trending Cryptocurrencies</h2>
                <div className="grid grid-cols-3 gap-4">

                {trendingData && Array.isArray(trendingData) ? (
                    trendingData.map((coin) => (
                        <Link to={`/${coin.item.id}`} className="text-blue-500 hover:text-blue-800">
                            <div key={coin.item.id} className="border border-gray-200 p-4 rounded shadow-md hover:shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                                <div className="flex items-center">
                                    <img src={coin.item.thumb} alt={coin.item.name} className='mr-2'/>

                                    <h2 className="text-xl font-semibold dark:text-blue-200">{coin.item.name}</h2>
                                </div>

                                <p className="text-gray-600 dark:text-white">{coin.item.symbol}</p>
                                
                                <p className="text-gray-800 dark:text-white">Price:
                                    <img src='https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579' alt='bitcoin' className="inline-block ml-2 mr-1" /> {coin.item.price_btc.toFixed(6)}
                                </p>

                                <p className="text-gray-800 dark:text-white">Market Cap Rank: {coin.item.market_cap_rank}</p>
                            </div> 
                        </Link>

                        ))
                    ) : (
                        <p>No trending data available.</p>
                    )}
                    
                </div>
                            
                <h2 className="text-2xl font-semibold mt-10 mb-5">Latest News</h2>

                {latestNews && Array.isArray(latestNews) ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {latestNews.slice(0, 6).map((item: any) => (

                    <div key={item.title} className="max-w-sm bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 mb-10 ring-1 ring-slate-900/5 shadow-lg hover:shadow-xl">

                        <a href={item.url}>
                            {/* 
                            <img src={item.image ? item.image : item.thumb_2x} alt={item.name} className="rounded-t-lg h-60 w-full object-cover" /> 
                            */}
                            <img src={item.thumb_2x ? item.thumb_2x : 'https://powderalloy.com/wp-content/uploads/2015/11/sidebar-placeholder.png'} alt={item.name} className="rounded-t-lg h-60 w-full object-cover" />

                        </a>

                        <div className="px-6 py-7">

                            <a href={item.url}>
                                <h3 className="text-lg font-semibold leading-tight mb-2">{item.title}</h3>
                            </a>

                            <p className="text-sm">{truncateDescription(item.description, 150)}</p>

                            <p className="text-sm py-4 text-slate-500 dark:text-slate-400"> {item.date ? item.date : formatDate(item.updated_at)}</p>
                            
                            <a href={item.url} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                Read more
                                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                            </a>
                        
                        </div>
                    </div>
                    
                    ))}
                </div>

                ) : (
                <p>No latest news available.</p>
                )}

            </div>

        </div>

    </>
)
}

export default Trending;