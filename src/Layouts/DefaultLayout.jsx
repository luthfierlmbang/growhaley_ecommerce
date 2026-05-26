import React, { Fragment } from 'react'
import { Outlet } from "react-router-dom"
import Navbar from '../Components/Nav/Navbar'
import Footer from '../Components/Nav/Footer'
import PageTransition from '../Components/Common/PageTransition'

const DefaultLayout = () => {
    return (
        <Fragment>
            <div className='w-full overflow-hidden'>
                <Navbar />

                <div className="mt-[98px]">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </div>

                <Footer />
            </div>
        </Fragment>
    )
}

export default DefaultLayout
