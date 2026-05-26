import React, { useState } from 'react'
import { Form } from 'react-bootstrap'

export const FilterProduct = () => {
    const dataFIlter = [
        "All",
        "T-Shirt",
        "Shirt",
        "Pants",
        "Accessories"
    ]

    const [Selected, setSelected] = useState("All")
    return (
        <div className='w-[682px] md:w-full'>
            <div className='flex items-center max-w-fit gap-4'>
                <Form.Select defaultValue="1" className='h-[40px] lg:h-[48px] text-[14px] lg:text-[16px] rounded-full pl-5 pr-10 shadow-none border-[#E5E5E5] focus:border-[#E5E5E5]'>
                    <option value="1">Women</option>
                    <option value="2">Man</option>
                </Form.Select>

                <div className="flex items-center gap-4">
                    {
                        dataFIlter.map((obj) => {
                            return <div key={obj} onClick={() => setSelected(obj)} className={'py-[8px] lg:py-[12px] flex-shrink-0 px-[20px] cursor-pointer text-[14px] lg:text-[16px] hover:bg-black hover:text-white rounded-full ' + (Selected === obj ? "bg-black text-white" : "")}>{obj}</div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
