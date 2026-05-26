import React from 'react'
import { Fragment } from 'react'
import { SearchIcon } from '../Icon/Icon'
import { Form, InputGroup } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { dataBlog } from '../../data/blogs'

const SideBlog = () => {
    const tagList = ["Lifestyle", "Promo", "Design", "Fashion", "Brand", "Fashion Week", "Trendy"]

    const profileUser = [
        {
            img: "/images/avatar.png",
            name: "Cooper Korsgaard",
            count: "29",
        },
        {
            img: "/images/avatar (1).png",
            name: "Jaydon Bergson",
            count: "29",
        },
        {
            img: "/images/sdfsfsd.png",
            name: "Ekstrom Bothman",
            count: "29",
        },
    ]
    return (
        <Fragment>
            <InputGroup className="w-full flex flex-nowrap items-center justify-between px-3 border border-solid border-[#E5E5E5] rounded-[8px] mb-6">
                <SearchIcon width={20} height={20} />
                <Form.Control
                    className='w-full border-none h-[48px] focus:border-none focus:shadow-none'
                    placeholder="Search..."
                    aria-label="Search..."
                    aria-describedby="basic-addon1"
                />
            </InputGroup>

            <div className="mb-6">
                <h4 className='text-[18px] lg:text-[20px] font-bold font-Helvetica mb-2'>Categories</h4>
                <div className="flex items-center gap-2 flex-wrap">
                    {
                        tagList.map((obj) => {
                            return <div key={obj} className="text-[12px] px-3 py-1 border border-solid !border-[#E5E5E5] rounded-full">{obj}</div>
                        })
                    }
                </div>
            </div>
            <div className="mb-6">
                <h4 className='text-[18px] lg:text-[20px] font-bold font-Helvetica mb-2'>Popular Article</h4>

                <div className="flex flex-wrap gap-4">

                    {
                        dataBlog.slice(0, 4).map((obj) => (
                            <NavLink key={obj.title} to="/blog/detail" className="w-full flex items-center gap-3">
                                <img src={obj.img} className='w-[112px] h-[112px] object-cover rounded-[4px]' alt={obj.title} />
                                <div>
                                    <p className='text-[12px] lg:text-[14px] mb-2'>{obj.date} | by {obj.by}</p>
                                    <h5 className='font-medium text-[14px] xl:text-[18px]'>{obj.title}</h5>
                                </div>
                            </NavLink>
                        ))
                    }

                </div>
            </div>

            <div className="mb-6">
                <h4 className='text-[18px] lg:text-[20px] font-bold font-Helvetica mb-2'>Popular Author</h4>

                <div className="flex flex-wrap gap-4">
                    {
                        profileUser.map((obj) => {
                            return <div key={obj.name} className="w-full flex items-center justify-between">
                                <div className="flex items-center flex gap-3">
                                    <img src={obj.img} className='w-[64px] h=[64px] object-cover rounded-full' alt="" />
                                    <div>
                                        <h5 className='font-medium text-[14px] xl:text-[18px]'>{obj.name}</h5>
                                        <p className='text-[12px] lg:text-[14px] text-gray'>{obj.count} Articles</p>
                                    </div>
                                </div>

                                <a href="#!" className='font-medium text-[12px] px-4 py-[4px] border border-solid !border-orange rounded-full text-orange hover:bg-orange  hover:text-white'>Follow</a>
                            </div>
                        })
                    }

                </div>
            </div>
        </Fragment>
    )
}

export default SideBlog
