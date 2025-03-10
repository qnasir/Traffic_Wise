import React from 'react'
import {Link} from 'react-router-dom'
import { 
    Github, 
    Twitter, 
    Facebook, 
    Instagram, 
    ArrowRight 
  } from 'lucide-react';

const Footer : React.FC = () => {
  return (
    <footer className='bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-200'>
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className='flex items-center space-x-2'>
                        <div className='bg-primary rounded-full h-8 w-8 flex items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        </div>
                        <span className='font-bold text-xl'>TrafficWise</span>
                    </div>
                    <p className='text-gray-600 dark:text-gray-400 text-sm'>Crowdsourced road safety platform helping drivers navigate roads safely with real-time alerts and traffic updates.</p>
                    <div className="flex space-x-4">
                        <a href="#" className='text-gray-500 hover:text-primary transition-colors'>
                            <Twitter className='w-5 h-5' />
                        </a>
                        <a href="#" className='text-gray-500 hover:text-primary transition-colors'>
                            <Facebook className='w-5 h-5' />
                        </a>
                        <a href="#" className='text-gray-500 hover:text-primary transition-colors'>
                            <Instagram className='w-5 h-5' />
                        </a>
                        <a href="#" className='text-gray-500 hover:text-primary transition-colors'>
                            <Github className='w-5 h-5' />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className='font-semibold text-lg mb-4'>Platform</h3>
                    <ul className='space-y-2'>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                How it works
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Safety features
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                How it works
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Report types
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Community guidelines
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className='font-semibold text-lg mb-4'>Support</h3>
                    <ul className='space-y-2'>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Contact us
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Privacy policy
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Terms of service
                            </Link>
                        </li>
                        <li>
                            <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>
                                Cookie policy
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-4">Stay Updated</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Get the latest updates about new features and safety alerts.
                    </p>
                    <div className='flex'>
                        <input type="email" placeholder='Enter your email' className='glass-input rounded-l-md py-2 px-3 w-full text-sm focus:outline-none' />
                        <button className='bg-primary hover:bg-primary/90 text-white px-3 rounded-r-md flex items-center justify-center'>
                            <ArrowRight className='w-4 h-4' />
                        </button>
                    </div>
                </div>
            </div>

            <div className='border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center'>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>© {new Date().getFullYear()} TrafficWise. All rights reserved.</p>
                <div className='flex space-x-6 mt-4 md:mt-0'>
                    <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>Privacy</Link>
                    <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>Terms</Link>
                    <Link to='#' className='text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm'>Cookies</Link>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer