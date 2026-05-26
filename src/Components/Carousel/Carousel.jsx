import React, { useEffect, useRef, useState } from 'react'
import Slider from "react-slick";
import { CardTestimonial } from '../Card/Card';

export const CarouselTestimonial = () => {
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1030,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
        ]
    };

    const dataCarousel = [
        {
            desc: "I recently purchased the most beautiful dress from this brand and I couldn't be happier with my purchase! The dress is made of high-quality materials and fits like a glove. The color is so vibrant and the cut is extremely flattering.",
            name: "James Lipshutz"
        },
        {
            desc: "I absolutely love my new shoes! They are so comfortable and stylish at the same time. The quality is amazing and they have held up really well after multiple wears. I especially love the attention to detail in the design - the little touches really make them stand out.",
            name: "Giana Dokidis"
        },
        {
            desc: "I've been using my new handbag for a few weeks now and I'm absolutely in love with it! The size is perfect - it's big enough to hold all of my essentials but not so big that it's cumbersome to carry around.",
            name: "Jordyn Botosh"
        },
        {
            desc: "I recently purchased the most beautiful dress from this brand and I couldn't be happier with my purchase! The dress is made of high-quality materials and fits like a glove. The color is so vibrant and the cut is extremely flattering.",
            name: "James Lipshutz"
        },
        {
            desc: "I absolutely love my new shoes! They are so comfortable and stylish at the same time. The quality is amazing and they have held up really well after multiple wears. I especially love the attention to detail in the design - the little touches really make them stand out.",
            name: "Giana Dokidis"
        },
        {
            desc: "I've been using my new handbag for a few weeks now and I'm absolutely in love with it! The size is perfect - it's big enough to hold all of my essentials but not so big that it's cumbersome to carry around.",
            name: "Jordyn Botosh"
        },
    ]
    return (
        <Slider {...settings} className="-mx-[15px]">
            {
                dataCarousel.map((obj, i) => {
                    return <div key={obj.name + i} className="px-[15px]">
                        <CardTestimonial data={obj} />
                    </div>
                })
            }
        </Slider>
    )
}


export const CarouselDetail = () => {
    const settings = {
        dots: false,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        afterChange: current => setActiveCarousel(current + 1),
    };
    const settings2 = {
        dots: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,
        adaptiveHeight: false,
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 780,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    vertical: false,
                    verticalSwiping: false,
                    adaptiveHeight: false,
                }
            },
        ]
    };

    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);
    const slider1 = useRef(null);
    const slider2 = useRef(null);

    const [ActiveCarousel, setActiveCarousel] = useState(1);
    const [TotalCarousel, setTotalCarousel] = useState(1);

    useEffect(() => {
        setNav1(slider1.current);
        setNav2(slider2.current);
        setTotalCarousel(slider2.current?.props.children.length)
    }, []);



    return (
        <div className='w-full relative'>
            <div className="absolute w-[2px] h-full bg-[#E5E5E5] -right-[1rem] top-0 lg:block hidden">
                <div className="relative w-full h-full">
                    <div className="absolute left-0 top-0 w-full bg-black transition-all" style={{ height: ((100 / TotalCarousel) * ActiveCarousel) + "%" }}></div>
                </div>
            </div>
            <div className="flex flex-wrap lg:!flex-nowrap gap-4 w-full">
                <div className='order-2 lg:!order-1 w-full lg:w-[100px]'>
                    <Slider {...settings2} asNavFor={nav2} ref={slider1} className='lg:h-[650px] -mx-[4px] lg:!mx-0'>
                        <div className='px-[4px] lg:!px-0'>
                            <img src="./../images/it (4).png" className='w-full object-cover h-[80px] lg:h-[100px]' alt="" />
                        </div>
                        <div className='px-[4px] lg:!px-0'>
                            <img src="./../images/it (1).png" className='w-full object-cover h-[80px] lg:h-[100px]' alt="" />
                        </div>
                        <div className='px-[4px] lg:!px-0'>
                            <img src="./../images/it (2).png" className='w-full object-cover h-[80px] lg:h-[100px]' alt="" />
                        </div>
                        <div className='px-[4px] lg:!px-0'>
                            <img src="./../images/it (3).png" className='w-full object-cover h-[80px] lg:h-[100px]' alt="" />
                        </div>
                    </Slider>
                </div>
                <div className='lg:!order-2 order-1 w-full lg:w-[calc(100%_-_(100px_+_1rem))]'>
                    <Slider {...settings} asNavFor={nav1} ref={slider2}>
                        <div>
                            <img src="./../images/sadas.png" className='w-full object-cover h-[500px] lg:h-[650px]' alt="" />
                        </div>
                        <div>
                            <img src="./../images/sadas.png" className='w-full object-cover h-[500px] lg:h-[650px]' alt="" />
                        </div>
                        <div>
                            <img src="./../images/sadas.png" className='w-full object-cover h-[500px] lg:h-[650px]' alt="" />
                        </div>
                        <div>
                            <img src="./../images/sadas.png" className='w-full object-cover h-[500px] lg:h-[650px]' alt="" />
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    )
}
