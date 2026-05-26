import React from 'react'
import { RightArrowIcon } from '../Icon/Icon'

export const PaginationDetail = () => {
    return (
        <div className='flex justify-center items-center gap-3 text-[14px] lg:text-[16px]'>
            <div className="flex items-center gap-2">
                <div className="rotate-180">
                    <RightArrowIcon />
                </div>
                <span>Previous</span>
            </div>

            <div className="w-[32px] h-[32px] flex justify-center items-center rounded-full text-black border border-solid border-[#E5E5E5] hover:!text-white hover:border-orange hover:bg-orange">
                1
            </div>
            <div className="w-[32px] h-[32px] lg:flex justify-center items-center rounded-full border border-solid  !text-white border-orange bg-orange hidden">
                2
            </div>
            <div className="w-[32px] h-[32px] lg:flex justify-center items-center rounded-full text-black border border-solid border-[#E5E5E5] hover:!text-white hover:border-orange hover:bg-orange hidden">
                3
            </div>
            <div className="w-[32px] h-[32px] flex justify-center items-center rounded-full text-black">
                ...
            </div>
            <div className="w-[32px] h-[32px] lg:flex justify-center items-center rounded-full text-black border border-solid border-[#E5E5E5] hover:!text-white hover:border-orange hover:bg-orange hidden">
                8
            </div>
            <div className="w-[32px] h-[32px] lg:flex justify-center items-center rounded-full text-black border border-solid border-[#E5E5E5] hover:!text-white hover:border-orange hover:bg-orange hidden">
                9
            </div>
            <div className="w-[32px] h-[32px] flex justify-center items-center rounded-full text-black border border-solid border-[#E5E5E5] hover:!text-white hover:border-orange hover:bg-orange">
                10
            </div>

            <div className="flex items-center gap-2">
                <span>Next</span>
                <div className="">
                    <RightArrowIcon />
                </div>
            </div>
        </div>
    )
}