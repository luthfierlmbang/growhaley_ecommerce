import React from 'react'
import { QuoteIcon } from '../Icon/Icon'
import { NavLink } from 'react-router-dom'

export const CardProduct = (props) => {
    return (
        <NavLink to="/detail" className="block overflow-hidden group">
            <div className="overflow-hidden rounded-[8px] md:rounded-[32px]">
                <img
                    src={props.data.img}
                    className='w-full h-[250px] md:h-[300px] lg:h-[350px] xl:h-[480px] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110'
                    alt={props.data.name}
                />
            </div>
            <div className="mt-3 flex flex-wrap md:flex-nowrap gap-y-2 items-center justify-between">
                <div className='w-full md:w-auto'>
                    <h3 className={'font-medium ' + (props.type === "small" ? "text-[14px] lg:text-[18px] xl:text-[20px]" : "text-[18px] lg:text-[20px] xl:text-[24px]")}>{props.data.name}</h3>
                    <p className={'text-gray ' + (props.type === "small" ? "text-[12px] lg:text-[14px]" : "text-[14px] lg:text-[16px]")}>{props.data.category}</p>
                </div>
                <div className={"btnClass border border-solid border-[#E5E5E5] font-medium " + (props.type === "small" ? "text-[16px] lg:text-[18px]" : "text-[18px] lg:text-[20px] xl:text-[24px]")}>${props.data.price}</div>
            </div>
        </NavLink>
    )
}


export const CardTestimonial = (props) => {
    return (
        <div className='p-[1.5rem] border border-solid border-[#E5E5E5] rounded-[24px]'>
            <QuoteIcon />
            <p className='text-[14px] lg:text-[16px] my-[1rem]'>{props.data.desc}</p>
            <h5 className='text-[14px] lg:text-[16px] font-medium'>{props.data.name}</h5>
        </div>
    )
}

export const CardBlog = (props) => {
    return (
        <NavLink to="/blog/detail" className='w-full'>
            <img src={props.data.img} className='w-full h-[240px] object-cover rounded-[8px] mb-6' alt="" />
            <div className="flex items-center gap-3 mb-2">
                <div className="font-medium text-[12px] px-4 py-[4px] border border-solid !border-[#E5E5E5] rounded-full text-black">{props.data.tag}</div>
                <span className='text-[12px] lg:text-[14px] text-[#A3A3A3]'>{props.data.date} | by {props.data.by}</span>
            </div>
            <h2 className='text-[16px] lg:text-[18px] font-medium'>{props.data.title}</h2>
        </NavLink>
    )
}
