import React, { Fragment, useState } from 'react'
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap'
import { CardProduct } from '../Components/Card/Card'
import { CloseIcon, DownIcon, FilterIcon, RightArrowIcon, SearchIcon } from '../Components/Icon/Icon'
import Subscribe from '../Components/Pages/Subscribe'
import { Range, getTrackBackground } from "react-range"
import { dataProduct as baseProducts } from '../data/products'
import AnimatedSection from '../Components/Common/AnimatedSection'

// Expand to 12 items for the product listing page
const dataProduct = [...baseProducts, ...baseProducts, ...baseProducts, ...baseProducts]

const Product = () => {
    const [SearchValue, setSearchValue] = useState("")
    const fieldChange = (e) => {
        setSearchValue(e.target.value)
    }

    const [Filter, setFilter] = useState(false)

    const filterData = [
        {
            products: [
                "Shirts",
                "Coats",
                "Skirts",
                "Jeans",
                "Pants",
                "Heels",
                "Dresses",
                "Sneakers",
                "Shoes",
            ],
            color: [
                {
                    name: "Yellows",
                    color: '#F4DE6E'
                },
                {
                    name: "Purple",
                    color: '#8152A0'
                },
                {
                    name: "Gray",
                    color: '#838382'
                },
                {
                    name: "White",
                    color: '#FFFFFF'
                },
                {
                    name: "Kaki",
                    color: '#8A8972'
                },
                {
                    name: "Browns",
                    color: '#614126'
                },
                {
                    name: "Roses",
                    color: '#D574B2'
                },
                {
                    name: "Black",
                    color: '#171717'
                },
                {
                    name: "Green",
                    color: '#6A873A'
                },
                {
                    name: "Maroon",
                    color: '#723020'
                },
                {
                    name: "Orange",
                    color: '#DF8F5A'
                },
                {
                    name: "Beiges",
                    color: '#CDBF9A'
                },
            ],
            style: [
                "Casual",
                "Basic",
                "Classic",
                "Spot",
                "Circular"
            ]
        }
    ]

    const [toogleProductFilter, settoogleProductFilter] = useState(true)
    const [tooglePriceFilter, settooglePriceFilter] = useState(true)
    const [toogleColorFilter, settoogleColorFilter] = useState(true)
    const [toogleStyleFilter, settoogleStyleFilter] = useState(true)

    const [selectColor, setselectColor] = useState([])

    const selectColorFiler = (e) => {
        if (selectColor.includes(e.color)) {
            setselectColor(selectColor.filter(item => item !== e.color))
        } else {
            setselectColor([...selectColor, e.color])
        }
    }

    // Derived value — no separate state needed
    const numberColor = selectColor.length


    // filter setup
    const STEP = 0.1;
    const MIN = 0;
    const MAX = 1000;
    const rtl = false;

    const [values, setValues] = useState([0, 1000]);
    // filter setup
    return (
        <Fragment>
            <section>
                <Container>
                    <AnimatedSection animation="fade-down">
                    <InputGroup className="w-full flex flex-nowrap items-center justify-between px-3 border border-solid border-[#E5E5E5] rounded-full mb-8">
                        <SearchIcon />
                        <Form.Control
                            className='w-full border-none h-[48px] focus:border-none focus:shadow-none'
                            placeholder="Search..."
                            aria-label="Search..."
                            aria-describedby="basic-addon1"
                            onChange={fieldChange}
                            value={SearchValue}
                        />
                        {
                            SearchValue !== "" ? <div className="cursor-pointer" onClick={() => setSearchValue("")}><CloseIcon /></div> : ""
                        }
                    </InputGroup>
                    </AnimatedSection>

                    <div className="mt-8">
                        <Row>
                            <Col className='order-2 md:!order-1' md={!Filter ? 12 : 9}>
                                <AnimatedSection animation="fade-up">
                                <div className="md:flex justify-between items-center mb-8">
                                    <h2 className='text-[24px] md:text-[28px] lg:text-[32px] font-Helvetica font-normal mb-4 md:!mb-0'>Search Result (48)</h2>
                                    {
                                        !Filter ? <div className="flex items-center justify-end gap-[1rem]">
                                            <div className="flex px-[24px] py-[16px] rounded-full border border border-[#E5E5E5] gap-[15px] items-center">
                                                <span className='font-medium text-[14px] lg:text-[16px]'>Short By</span> <DownIcon />
                                            </div>
                                            <div className="flex px-[24px] py-[16px] rounded-full border border border-[#E5E5E5] gap-[15px] items-center cursor-pointer" onClick={() => setFilter(!Filter)}>
                                                <span className='font-medium text-[14px] lg:text-[16px]'>Filter</span> <FilterIcon />
                                            </div>
                                        </div> : ""
                                    }

                                </div>
                                </AnimatedSection>
                                <Row className='gap-y-[15px]'>
                                    {
                                        dataProduct.map((obj, i) => {
                                            return <Col key={obj.name + i} className="col-6" md={!Filter ? 4 : 6} xl={!Filter ? 3 : 4}>
                                                <AnimatedSection animation="fade-up" delay={`anim-delay-${Math.min((i % 4 + 1) * 100, 400)}`}>
                                                    <CardProduct type={"small"} data={obj} />
                                                </AnimatedSection>
                                            </Col>
                                        })
                                    }
                                </Row>
                            </Col>
                            {
                                Filter ? <Col className='md:!order-2 order-1 mb-4 md:!mb-0' md={3}>
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <h5 className='flex items-center'>
                                                <div className="cursor-pointer" onClick={() => setFilter(!Filter)}>
                                                    <CloseIcon />
                                                </div>
                                                <span className='ml-2 text-[16px] lg:text-[20px]'>Filter</span>
                                            </h5>

                                            <p className='cursor-pointer mb-0 text-[12px] text-orange underline'>Reset Filter</p>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => settoogleProductFilter(!toogleProductFilter)}>
                                                <h5 className='text-[16px] lg:text-[18px]'>Kind of Product</h5>
                                                <div className={"relative arrowPlus w-[24px] h-[24px] " + (toogleProductFilter ? "active" : "")}>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            {
                                                toogleProductFilter ?
                                                    <Fragment>
                                                        <hr className='my-4 border-[#E5E5E5]' />

                                                        <div className='flex flex-wrap gap-[12px]'>
                                                            {
                                                                filterData[0].products.map((obj) => {
                                                                    return <div key={obj} className="flex items-center justify-between w-full cursor-pointer">
                                                                        <div className='text-[14px] lg:text-[16px]'>{obj}</div>
                                                                        <RightArrowIcon />
                                                                    </div>
                                                                })
                                                            }

                                                        </div>
                                                    </Fragment> : ""
                                            }
                                        </div>

                                        <div className='my-6'>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => settooglePriceFilter(!tooglePriceFilter)}>
                                                <h5 className='text-[16px] lg:text-[18px]'>Price</h5>
                                                <div className={"relative arrowPlus w-[24px] h-[24px] " + (tooglePriceFilter ? "active" : "")}>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            {
                                                tooglePriceFilter ?
                                                    <Fragment>
                                                        <Range
                                                            values={values}
                                                            step={STEP}
                                                            min={MIN}
                                                            max={MAX}
                                                            rtl={rtl}
                                                            onChange={(values) => {
                                                                setValues(values);
                                                            }}
                                                            renderTrack={({ props, children }) => (
                                                                <div
                                                                    onMouseDown={props.onMouseDown}
                                                                    onTouchStart={props.onTouchStart}
                                                                    style={{
                                                                        ...props.style,
                                                                        height: "36px",
                                                                        display: "flex",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <div
                                                                        ref={props.ref}
                                                                        style={{
                                                                            height: "5px",
                                                                            width: "100%",
                                                                            borderRadius: "4px",
                                                                            background: getTrackBackground({
                                                                                values,
                                                                                colors: ["#E5E5E5", "#E16F3D", "#E5E5E5"],
                                                                                min: MIN,
                                                                                max: MAX,
                                                                                rtl,
                                                                            }),
                                                                            alignSelf: "center",
                                                                        }}
                                                                    >
                                                                        {children}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            renderThumb={({ props, isDragged }) => (
                                                                <div
                                                                    {...props}
                                                                    style={{
                                                                        ...props.style,
                                                                        height: "18px",
                                                                        width: "18px",
                                                                        borderRadius: "50%",
                                                                        backgroundColor: "#E16F3D",
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        boxShadow: "none",
                                                                    }}
                                                                ></div>
                                                            )}
                                                        />

                                                        <div className="flex justify-between items-center">
                                                            <h5 className='text-[12px]'>${Math.round(values[0])}</h5>
                                                            <h5 className='text-[12px]'>${Math.round(values[1])}</h5>
                                                        </div>
                                                    </Fragment> : ""
                                            }
                                        </div>



                                        <div className='mb-6'>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => settoogleColorFilter(!toogleColorFilter)}>
                                                <h5 className='text-[16px] lg:text-[18px]'>Color ({numberColor})</h5>
                                                <div className={"relative arrowPlus w-[24px] h-[24px] " + (toogleColorFilter ? "active" : "")}>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            {
                                                toogleColorFilter ?
                                                    <Fragment>
                                                        <hr className='my-4 border-[#E5E5E5]' />
                                                        <div className="grid grid-cols-4 grid-rows-3 gap-[15px]">

                                                            {
                                                                filterData[0].color.map((obj) => {
                                                                    return <div key={obj.name} className='justify-center cursor-pointer flex flex-wrap gap-[15px]' onClick={() => selectColorFiler(obj)}>
                                                                        <div className={"px-[5px] py-[5px] rounded-full " + (selectColor.includes(obj.color) ? "border border-solid !border-[#838382] " : "border border-solid !border-white")}>
                                                                            <div className={"w-[42px] h-[42px] rounded-full " + (obj.name === "White" ? "border border-solid border-[#F5F5F5]" : "")} style={{ backgroundColor: obj.color }}></div>
                                                                        </div>
                                                                        <h5 className='font-normal text-[12px]'>{obj.name}</h5>
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                    </Fragment> : ""
                                            }
                                        </div>



                                        <div>
                                            <div className="flex items-center justify-between cursor-pointer" onClick={() => settoogleStyleFilter(!toogleStyleFilter)}>
                                                <h5 className='text-[16px] lg:text-[18px]'>Style</h5>
                                                <div className={"relative arrowPlus w-[24px] h-[24px] " + (toogleStyleFilter ? "active" : "")}>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                            {
                                                toogleStyleFilter ?
                                                    <Fragment>
                                                        <hr className='my-4 border-[#E5E5E5]' />

                                                        <div className='flex flex-wrap gap-[12px]'>
                                                            {
                                                                filterData[0].style.map((obj) => {
                                                                    return <div key={obj} className="flex items-center justify-between w-full cursor-pointer">
                                                                        <div className='text-[14px] lg:text-[16px]'>{obj}</div>
                                                                        <RightArrowIcon />
                                                                    </div>
                                                                })
                                                            }

                                                        </div>
                                                    </Fragment> : ""
                                            }
                                        </div>

                                    </div>
                                </Col> : ""
                            }
                        </Row>
                    </div>
                </Container>
            </section>


            <Subscribe />
        </Fragment >
    )
}

export default Product
