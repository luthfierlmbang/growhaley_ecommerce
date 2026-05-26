import React, { Fragment, useState } from 'react'
import { LikeBoldIcon, LikeOutlineIcon, MoreOptionIcon, ShareIcon, StarRateIcon, UnlikeBoldIcon, UnlikeOutlineIcon } from '../Icon/Icon'
import { Col, Row } from 'react-bootstrap'

// Extracted as a proper component so hooks are called correctly
const LikeUnlike = ({ showShare = false, onReplyToggle = null, replyLabel = null }) => {
    const [like, setLike] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [unlike, setUnlike] = useState(false)
    const [unlikeCount, setUnlikeCount] = useState(0)

    const handleToggle = (type) => {
        if (type === 'like') {
            if (unlike) { setUnlike(false); setUnlikeCount(c => c - 1) }
            if (!like) { setLike(true); setLikeCount(c => c + 1) }
            else { setLike(false); setLikeCount(c => c - 1) }
        } else {
            if (like) { setLike(false); setLikeCount(c => c - 1) }
            if (!unlike) { setUnlike(true); setUnlikeCount(c => c + 1) }
            else { setUnlike(false); setUnlikeCount(c => c - 1) }
        }
    }

    return (
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className='cursor-pointer' onClick={() => handleToggle('like')}>
                    {like ? <LikeBoldIcon /> : <LikeOutlineIcon />}
                </div>
                <span className='text-[12px] lg:text-[14px] text-[#525252]'>{likeCount}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className='cursor-pointer' onClick={() => handleToggle('unlike')}>
                    {unlike ? <UnlikeBoldIcon /> : <UnlikeOutlineIcon />}
                </div>
                <span className='text-[12px] lg:text-[14px] text-[#525252]'>{unlikeCount}</span>
            </div>
            {showShare && (
                <div className="flex items-center gap-2">
                    <ShareIcon />
                    <span className='text-[12px] lg:text-[14px] text-[#525252]'>0</span>
                    {onReplyToggle && (
                        <span className='text-[12px] lg:text-[14px] cursor-pointer font-medium' onClick={onReplyToggle}>
                            {replyLabel}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export const CartList = () => {
    const [countCart, setCountCart] = useState(1)
    const [checked, setChecked] = useState(false)

    return (
        <Fragment>
            <Row className='w-full'>
                <Col className='mb-2 my-md-auto' md={6}>
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => setChecked(!checked)}
                            role="checkbox"
                            aria-checked={checked}
                            tabIndex={0}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setChecked(!checked) }}
                            className={"w-[24px] h-[24px] rounded-full border border-solid flex items-center justify-center cursor-pointer " + (checked ? "border-orange bg-orange" : "border-[#A3A3A3]")}
                        >
                            {checked && <img src="/images/check (3).svg" alt="checked" />}
                        </div>
                        <div className='flex items-center gap-3'>
                            <img src="/images/it (4).png" className='w-[100px] xl:w-[128px] h-[100px] xl:h-[128px] rounded-[8px] object-cover' alt="Winter Coat" />
                            <div>
                                <h4 className='font-semibold text-[18px] mb-2'>Winter Coat</h4>
                                <p className='text-[18px] text-[#A3A3A3] font-normal'>Beiges <span className='font-medium text-black'>M</span></p>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={4} className='mb-2 my-md-auto'>
                    <div className="flex items-center justify-end md:justify-start gap-4 xl:gap-6">
                        <div className="flex items-center gap-2 xl:gap-3">
                            <img src="/images/size.svg" className='cursor-pointer' onClick={() => setCountCart(c => Math.max(1, c - 1))} alt="decrease" />
                            <div className="w-[32px] h-[32px] rounded-full flex justify-center items-center text-[14px] lg:text-[16px] border border-solid border-[#E5E5E5] flex-shrink-0">{countCart}</div>
                            <img src="/images/size (1).svg" className='cursor-pointer' onClick={() => setCountCart(c => c + 1)} alt="increase" />
                        </div>
                        <div className="flex items-center gap-3 cursor-pointer">
                            <img src="/images/trash.svg" alt="remove" />
                            <span className='font-medium text-[12px] lg:text-[14px]'>Remove</span>
                        </div>
                    </div>
                </Col>
                <Col className='text-right my-auto'>
                    <h5 className='text-[18px] font-medium'>$124.99</h5>
                </Col>
            </Row>
        </Fragment>
    )
}

export const ListComment = ({ replayIcon = false }) => {
    return (
        <Fragment>
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img src="/images/avatar.png" className='w-[48px] h-[48px] rounded-full object-cover' alt="Kierra Bergson" />
                        <div>
                            <h4 className='font-medium text-[18px] mb-1'>Kierra Bergson</h4>
                            <div className="flex items-center">
                                <div className="flex items-center gap-[2px]">
                                    {[1,2,3,4,5].map(n => <StarRateIcon key={n} />)}
                                </div>
                                <div className='text-[12px] ml-2 text-gray'>1 week ago</div>
                            </div>
                        </div>
                    </div>
                    <MoreOptionIcon />
                </div>
                <div className="ml-[4rem]">
                    <p className='text-[14px] lg:text-[16px] mb-3'>I am thrilled with my recent purchase, a dress from brand X. The fabric is of high quality and feels comfortable on the skin. The design is fashionable and unique. I have received many compliments when wearing it. The shopping experience on this website was delightful, and I will definitely return to buy more products!</p>
                    <LikeUnlike showShare={replayIcon} />
                </div>
            </div>
        </Fragment>
    )
}

export const ListCommentDiscussion = ({ replay = false }) => {
    const [showReplies, setShowReplies] = useState(replay)

    return (
        <Fragment>
            <div className={'relative ' + (showReplies ? "line__three" : "")}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <img src="/images/avatar.png" className='w-[48px] h-[48px] rounded-full object-cover' alt="Kierra Bergson" />
                        <div>
                            <h4 className='font-medium text-[18px] mb-1'>Kierra Bergson</h4>
                            <div className="flex items-center">
                                <div className="flex items-center gap-[2px]">
                                    {[1,2,3,4,5].map(n => <StarRateIcon key={n} />)}
                                </div>
                                <div className='text-[12px] ml-2 text-gray'>1 week ago</div>
                            </div>
                        </div>
                    </div>
                    <MoreOptionIcon />
                </div>
                <div className="ml-[4rem]">
                    <p className='text-[14px] lg:text-[16px] mb-3'>I am thrilled with my recent purchase, a dress from brand X. The fabric is of high quality and feels comfortable on the skin. The design is fashionable and unique. I have received many compliments when wearing it. The shopping experience on this website was delightful, and I will definitely return to buy more products!</p>
                    <LikeUnlike
                        showShare={true}
                        onReplyToggle={() => setShowReplies(!showReplies)}
                        replyLabel={showReplies ? "Hide replies" : "Show Replies"}
                    />
                </div>
                {showReplies && (
                    <div className="ml-[4rem] mt-8 flex flex-wrap gap-4 last__comment-line">
                        <div className="relative">
                            <ListComment replayIcon={true} />
                            <img src="/images/line.svg" className='absolute -z-[1] -left-[2.521rem] top-0' alt="" />
                        </div>
                        <div className="relative">
                            <ListComment replayIcon={true} />
                            <img src="/images/line.svg" className='absolute -z-[1] -left-[2.521rem] top-0' alt="" />
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    )
}
