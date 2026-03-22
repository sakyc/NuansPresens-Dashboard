import { FC } from 'react';
import { Link, Outlet } from "react-router";
import ScrollToTop from 'src/components/shared/ScrollToTop';
import Sidebar from './sidebar/Sidebar';
import Header from './header/Header';



const FullLayout: FC = () => {
  return (
    <>
      <div className="flex w-full bg-lightgray dark:bg-dark_tebel *:min-h-screen">
        <div className="page-wrapper flex w-full h-full">
          {/* Header/sidebar */}
          <Sidebar />
          <div className="page-wrapper-sub flex flex-col w-full ">
            {/* Top Header  */}
            <Header />

            <div
              className={`h-100`}
            >
              {/* Body Content  */}
              <div
                className={`w-full`}
              >
                <ScrollToTop>
                  <div className="container py-30">
                    <Outlet />
                  </div>
                </ScrollToTop>
              </div>
              
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default FullLayout;
