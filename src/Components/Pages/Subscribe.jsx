import React from 'react'
import { Container } from 'react-bootstrap'

const Subscribe = () => {
    return (
        <section>
            <Container>
                <div className="bg-[#F6F6F6] px-[0.5rem] sm:px-[5rem] md:px-[10rem] py-[2rem] lg:py-[4rem] rounded-[24px] text-center">
                    <h2 className='font-Helvetica font-normal text-[24px] md:text-[28px] lg:text-[32px] xl:text-[48px] mb-2 lg:mb-4'>Subscribe Newsletter and Get $15 Off</h2>
                    <p className='text-[14px] lg:text-[16px] text-gray mb-6 lg:mb-12'>80+ Molestie hendrerit amet sapien volutpat. </p>

                    <div className="flex items-center justify-center gap-[1rem]">
                        <input type="text" placeholder='Enter mail address' className='fieldInput !h-[42px] w-full sm:w-auto sm:!h-[58px] text-[14px] lg:text-[16px]' />
                        <button href="#!" className='btnClass font-medium text-[14px] lg:text-[16px] bg-orange !border-orange text-white !px-[20px] !py-[8px] sm:!px-[40px] sm:!py-[16px]'>Subscribe</button>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Subscribe
