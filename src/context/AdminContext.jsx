import React, { createContext, useContext, useState } from 'react'
import { dataBlog } from '../data/blogs'

const AdminContext = createContext(null)

const ADMIN_CREDENTIALS = { email: 'admin@lux.com', password: 'lux2025', name: 'Admin Lux' }

/* ── Helpers ── */
const iso = (daysAgo = 0, hoursAgo = 0) => {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    d.setHours(d.getHours() - hoursAgo)
    return d.toISOString()
}

const mkEvent = (id, at, type, from, to, note = '') => ({
    id, at, by: 'Admin Lux', type, from, to, note,
})

const trackingUrlMap = (courier) => {
    if (!courier) return null
    const c = courier.toLowerCase()
    if (c.includes('dhl'))   return 'https://www.dhl.com/tracking'
    if (c.includes('fedex')) return 'https://www.fedex.com/tracking'
    if (c.includes('ups'))   return 'https://www.ups.com/tracking'
    if (c.includes('usps'))  return 'https://tools.usps.com/go/TrackConfirmAction'
    return null
}

/* ── Computed status from fulfillmentStatus ── */
export const deriveStatus = (fulfillmentStatus) => {
    switch (fulfillmentStatus) {
        case 'Unfulfilled':
        case 'Picking':
        case 'Packed':               return 'Processing'
        case 'Shipped':              return 'Shipped'
        case 'Delivered':            return 'Completed'
        case 'Cancelled':            return 'Cancelled'
        case 'Partially Cancelled':  return 'Processing'
        case 'Returned':             return 'Cancelled'
        default:                     return 'Processing'
    }
}

/* ── Seed inventory ── */
const seedInventory = () => [
    { id: 1, img: '/images/p (2).png', name: 'Winter Coat',    category: 'Coat',        price: 144.99, stock: 24, sold: 38, status: 'Active' },
    { id: 2, img: '/images/p (3).png', name: 'Autumn Dress',   category: 'Dress',       price: 124.99, stock: 12, sold: 55, status: 'Active' },
    { id: 3, img: '/images/p (1).png', name: 'Casual T-Shirt', category: 'T-Shirt',     price: 39.99,  stock: 60, sold: 120, status: 'Active' },
    { id: 4, img: '/images/p (2).png', name: 'Slim Jeans',     category: 'Pants',       price: 89.99,  stock: 5,  sold: 30, status: 'Low Stock' },
    { id: 5, img: '/images/p (3).png', name: 'Floral Skirt',   category: 'Skirt',       price: 69.99,  stock: 0,  sold: 18, status: 'Out of Stock' },
    { id: 6, img: '/images/p (1).png', name: 'Denim Jacket',   category: 'Jacket',      price: 159.99, stock: 18, sold: 22, status: 'Active' },
    { id: 7, img: '/images/p (2).png', name: 'Sneakers Pro',   category: 'Shoes',       price: 119.99, stock: 9,  sold: 44, status: 'Active' },
    { id: 8, img: '/images/p (3).png', name: 'Leather Bag',    category: 'Accessories', price: 199.99, stock: 7,  sold: 15, status: 'Active' },
]

/* ── Seed orders with new 2-dimension status model ── */
const seedOrders = () => {
    const methods   = ['DHL', 'FedEx']
    const payments  = ['PayPal', 'Apple Pay', 'Credit Card']
    const names     = ['James Lipshutz', 'Giana Dokidis', 'Jordyn Botosh', 'Kierra Bergson', 'Cooper Korsgaard', 'Jaydon Bergson']
    const addresses = [
        { street: '1536 Stellar Dr',      city: 'Kenai',          region: 'Alaska',         postal: '99611', country: 'USA', phone: '(907) 283-6173' },
        { street: '2336 Jack Warren Rd',  city: 'Delta Junction', region: 'Alaska',         postal: '99737', country: 'USA', phone: '(907) 895-4411' },
        { street: '88 Pine Street',       city: 'New York',       region: 'New York',       postal: '10005', country: 'USA', phone: '(212) 555-0198' },
        { street: '450 Sunset Blvd',      city: 'Los Angeles',    region: 'California',     postal: '90028', country: 'USA', phone: '(323) 555-0147' },
        { street: '77 Wacker Dr',         city: 'Chicago',        region: 'Illinois',       postal: '60601', country: 'USA', phone: '(312) 555-0122' },
        { street: '300 Boylston St',      city: 'Boston',         region: 'Massachusetts',  postal: '02116', country: 'USA', phone: '(617) 555-0133' },
    ]
    const trackingNums = ['1Z999AA10123456784', '9400111899223397658', '7489023641', '1Z12345E0205271688', '9261290100830049000', '1Z9999999999999999']
    const itemSets = [
        [{ name: 'Winter Coat',    price: '144.99', qty: 1, img: '/images/p (2).png', selectedSize: 'M',  selectedColor: '#CDBF9A', colorName: 'Beiges' }],
        [{ name: 'Autumn Dress',   price: '124.99', qty: 2, img: '/images/p (3).png', selectedSize: 'S',  selectedColor: '#D574B2', colorName: 'Roses' }],
        [{ name: 'Casual T-Shirt', price: '39.99',  qty: 3, img: '/images/p (1).png', selectedSize: 'L',  selectedColor: '#171717', colorName: 'Black' }],
        [{ name: 'Slim Jeans',     price: '89.99',  qty: 1, img: '/images/p (2).png', selectedSize: 'M',  selectedColor: '#614126', colorName: 'Browns' }],
        [{ name: 'Denim Jacket',   price: '159.99', qty: 1, img: '/images/p (3).png', selectedSize: 'XL', selectedColor: '#838382', colorName: 'Gray' }],
        [{ name: 'Sneakers Pro',   price: '119.99', qty: 2, img: '/images/p (1).png', selectedSize: '42', selectedColor: '#171717', colorName: 'Black' }],
    ]

    // fulfillmentStatus cycle for 18 orders
    const fStatuses = [
        'Delivered', 'Unfulfilled', 'Shipped', 'Cancelled',
        'Packed',    'Delivered',   'Picking', 'Shipped',
        'Unfulfilled','Cancelled',  'Delivered','Packed',
        'Shipped',   'Picking',     'Unfulfilled','Delivered',
        'Cancelled', 'Shipped',
    ]
    // paymentStatus: mostly Paid, 2 Pending
    const pStatuses = [
        'Paid','Pending','Paid','Paid',
        'Paid','Paid','Paid','Paid',
        'Pending','Paid','Paid','Paid',
        'Paid','Paid','Paid','Paid',
        'Paid','Paid',
    ]

    return Array.from({ length: 18 }, (_, i) => {
        const itemSet         = itemSets[i % itemSets.length]
        const total           = itemSet.reduce((s, it) => s + parseFloat(it.price) * it.qty, 0)
        const daysAgo         = Math.floor(Math.random() * 30) + 1
        const d               = new Date(); d.setDate(d.getDate() - daysAgo)
        const fulfillmentStatus = fStatuses[i]
        const paymentStatus   = pStatuses[i]
        const status          = deriveStatus(fulfillmentStatus)
        const courier         = methods[i % methods.length]
        const hasTracking     = ['Shipped', 'Delivered'].includes(fulfillmentStatus)
        const trackingNumber  = hasTracking ? trackingNums[i % trackingNums.length] : null
        const slaHours        = Math.floor(Math.random() * 71) + 1

        // Build events based on fulfillmentStatus
        const events = []
        let eid = 1
        events.push(mkEvent(eid++, iso(daysAgo, 0), 'order_placed', '', 'Unfulfilled', 'Order received and payment confirmed.'))
        if (paymentStatus === 'Paid') {
            events.push(mkEvent(eid++, iso(daysAgo, -1), 'payment_received', 'Pending', 'Paid', `Payment of $${total.toFixed(2)} received via ${payments[i % payments.length]}.`))
        }
        if (['Picking','Packed','Shipped','Delivered'].includes(fulfillmentStatus)) {
            events.push(mkEvent(eid++, iso(daysAgo - 1, 0), 'fulfillment_started', 'Unfulfilled', 'Picking', 'Fulfillment started. Items being picked from warehouse.'))
            itemSet.forEach(item => {
                events.push(mkEvent(eid++, iso(daysAgo - 1, -1), 'item_picked', '', '', `Picked: ${item.name} — Size ${item.selectedSize} — Color ${item.colorName} × ${item.qty}`))
            })
        }
        if (['Packed','Shipped','Delivered'].includes(fulfillmentStatus)) {
            events.push(mkEvent(eid++, iso(daysAgo - 2, 0), 'packed', 'Picking', 'Packed', 'Package packed and ready for shipment.'))
        }
        if (['Shipped','Delivered'].includes(fulfillmentStatus)) {
            events.push(mkEvent(eid++, iso(daysAgo - 3, 0), 'tracking_added', '', '', `Tracking number ${trackingNumber} added. Courier: ${courier}.`))
            events.push(mkEvent(eid++, iso(daysAgo - 3, -1), 'shipped', 'Packed', 'Shipped', `Package handed to ${courier}.`))
            events.push(mkEvent(eid++, iso(daysAgo - 3, -2), 'customer_notified', '', '', 'Customer notified via email with tracking information.'))
        }
        if (fulfillmentStatus === 'Delivered') {
            events.push(mkEvent(eid++, iso(daysAgo - 5, 0), 'delivered', 'Shipped', 'Delivered', 'Package delivered to customer.'))
        }
        if (fulfillmentStatus === 'Cancelled') {
            events.push(mkEvent(eid++, iso(daysAgo - 1, 0), 'cancelled', 'Unfulfilled', 'Cancelled', 'Order cancelled. Refund initiated.'))
            events.push(mkEvent(eid++, iso(daysAgo - 1, -1), 'customer_notified', '', '', 'Customer notified of cancellation via email.'))
        }

        // refundHistory seed
        const refundHistory = fulfillmentStatus === 'Cancelled' ? [{
            id: `RF-${String(1000 + i).padStart(4, '0')}`,
            amount: parseFloat(total.toFixed(2)),
            method: 'Original Payment Method',
            reason: 'Item out of stock',
            at: iso(daysAgo - 2, 0),
            items: [],
        }] : []

        return {
            ref:               `LUX-${String(1000 + i).padStart(4, '0')}`,
            customer:          names[i % names.length],
            email:             `customer${i + 1}@email.com`,
            phone:             addresses[i % addresses.length].phone,
            address:           addresses[i % addresses.length],
            items:             itemSet,
            total:             parseFloat(total.toFixed(2)),
            subtotal:          parseFloat(total.toFixed(2)),
            discount:          0,
            shippingCost:      courier === 'FedEx' ? 0.88 : 0,
            fulfillmentStatus,
            paymentStatus,
            status,
            shippingMethod:    courier,
            paymentMethod:     payments[i % payments.length],
            trackingNumber,
            trackingUrl:       hasTracking ? trackingUrlMap(courier) : null,
            deliveryStep:      fulfillmentStatus === 'Delivered' ? 4 : fulfillmentStatus === 'Shipped' ? 2 : fulfillmentStatus === 'Cancelled' ? -1 : 1,
            date:              d.toISOString(),
            cancelReason:      fulfillmentStatus === 'Cancelled' ? 'Item out of stock' : null,
            cancelMessage:     fulfillmentStatus === 'Cancelled' ? 'We apologize, your order has been cancelled due to stock unavailability. A full refund has been initiated.' : null,
            cancelledItems:    [],
            packingNotes:      ['Packed','Shipped','Delivered'].includes(fulfillmentStatus) ? 'Handle with care. Fragile items inside.' : '',
            weight:            ['Packed','Shipped','Delivered'].includes(fulfillmentStatus) ? `${(Math.random() * 3 + 0.5).toFixed(1)} kg` : '',
            boxSize:           ['Packed','Shipped','Delivered'].includes(fulfillmentStatus) ? ['Small','Medium','Large'][i % 3] : '',
            refundedAmount:    fulfillmentStatus === 'Cancelled' ? parseFloat(total.toFixed(2)) : 0,
            refundedAt:        fulfillmentStatus === 'Cancelled' ? iso(daysAgo - 2, 0) : null,
            refundHistory,
            slaHours,
            notes:             [],
            events,
        }
    })
}

/* ── Seed customers ── */
const seedCustomers = () => [
    { id: 1, name: 'James Lipshutz',   email: 'james@email.com',   orders: 5, totalSpent: 724.95,  joined: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Giana Dokidis',    email: 'giana@email.com',   orders: 3, totalSpent: 374.97,  joined: '2024-02-20', status: 'Active' },
    { id: 3, name: 'Jordyn Botosh',    email: 'jordyn@email.com',  orders: 8, totalSpent: 1199.92, joined: '2023-11-05', status: 'Active' },
    { id: 4, name: 'Kierra Bergson',   email: 'kierra@email.com',  orders: 2, totalSpent: 249.98,  joined: '2024-03-10', status: 'Active' },
    { id: 5, name: 'Cooper Korsgaard', email: 'cooper@email.com',  orders: 1, totalSpent: 144.99,  joined: '2024-04-01', status: 'Active' },
    { id: 6, name: 'Jaydon Bergson',   email: 'jaydon@email.com',  orders: 0, totalSpent: 0,       joined: '2024-05-12', status: 'Inactive' },
]

export const AdminProvider = ({ children }) => {
    const [adminUser, setAdminUser]         = useState(null)
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
    const [inventory, setInventory]         = useState(seedInventory())
    const [orders, setOrders]               = useState(seedOrders())
    const [customers]                       = useState(seedCustomers())
    const [blogs, setBlogs]                 = useState(dataBlog.map((b, i) => ({ ...b, id: i + 1, status: 'Published', views: Math.floor(Math.random() * 500 + 50) })))

    /* ── Auth ── */
    const adminLogin = (email, password) => {
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            const u = { email: ADMIN_CREDENTIALS.email, name: ADMIN_CREDENTIALS.name }
            setAdminUser(u)
            setIsAdminLoggedIn(true)
            return { success: true }
        }
        return { success: false, error: 'Invalid credentials.' }
    }
    const adminLogout = () => { setAdminUser(null); setIsAdminLoggedIn(false) }

    /* ── Inventory ── */
    const updateProduct = (id, data) =>
        setInventory(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    const addProduct = (data) =>
        setInventory(prev => [...prev, { ...data, id: Date.now(), sold: 0 }])
    const deleteProduct = (id) =>
        setInventory(prev => prev.filter(p => p.id !== id))

    /* ── Orders: legacy compat ── */
    const updateOrderStatus = (ref, status, extra = {}) =>
        setOrders(prev => prev.map(o => o.ref === ref ? { ...o, status, ...extra } : o))

    const addOrderNote = (ref, note) =>
        setOrders(prev => prev.map(o => o.ref === ref ? { ...o, notes: [...(o.notes || []), note] } : o))

    /* ── Orders: new actions ── */
    const _addEvent = (ref, event) =>
        setOrders(prev => prev.map(o =>
            o.ref === ref ? { ...o, events: [...(o.events || []), event] } : o
        ))

    const updateFulfillmentStatus = (ref, fulfillmentStatus, extra = {}) =>
        setOrders(prev => prev.map(o =>
            o.ref === ref ? { ...o, fulfillmentStatus, status: deriveStatus(fulfillmentStatus), ...extra } : o
        ))

    const addEvent = (ref, event) => _addEvent(ref, event)

    const addTrackingNumber = (ref, trackingNumber, courier) => {
        const at = new Date().toISOString()
        setOrders(prev => prev.map(o => {
            if (o.ref !== ref) return o
            const newEvents = [
                ...(o.events || []),
                mkEvent(Date.now(), at, 'tracking_added', '', '', `Tracking number ${trackingNumber} added. Courier: ${courier}.`),
            ]
            return { ...o, trackingNumber, trackingUrl: trackingUrlMap(courier), events: newEvents }
        }))
    }

    const markPacked = (ref, { weight, boxSize, packingNotes }) => {
        const at = new Date().toISOString()
        setOrders(prev => prev.map(o => {
            if (o.ref !== ref) return o
            const newEvents = [
                ...(o.events || []),
                mkEvent(Date.now(), at, 'packed', o.fulfillmentStatus, 'Packed', `Packed: ${weight}, ${boxSize} box. ${packingNotes || ''}`),
            ]
            return { ...o, fulfillmentStatus: 'Packed', status: deriveStatus('Packed'), weight, boxSize, packingNotes, events: newEvents }
        }))
    }

    const markShipped = (ref, { trackingNumber, courier }) => {
        const at = new Date().toISOString()
        setOrders(prev => prev.map(o => {
            if (o.ref !== ref) return o
            const newEvents = [
                ...(o.events || []),
                mkEvent(Date.now() + 1, at, 'tracking_added', '', '', `Tracking number ${trackingNumber} added. Courier: ${courier}.`),
                mkEvent(Date.now() + 2, at, 'shipped', o.fulfillmentStatus, 'Shipped', `Package handed to ${courier}.`),
            ]
            return {
                ...o,
                fulfillmentStatus: 'Shipped',
                status: deriveStatus('Shipped'),
                trackingNumber,
                trackingUrl: trackingUrlMap(courier),
                shippingMethod: courier,
                events: newEvents,
            }
        }))
    }

    const markDelivered = (ref) => {
        const at = new Date().toISOString()
        setOrders(prev => prev.map(o => {
            if (o.ref !== ref) return o
            const newEvents = [
                ...(o.events || []),
                mkEvent(Date.now(), at, 'delivered', 'Shipped', 'Delivered', 'Package delivered to customer.'),
            ]
            return { ...o, fulfillmentStatus: 'Delivered', status: deriveStatus('Delivered'), events: newEvents }
        }))
    }

    /* ── cancelOrder: supports partial cancel ── */
    const cancelOrder = (ref, { reason, message, refundAmount, partialItems }) => {
        const at = new Date().toISOString()
        setOrders(prev => prev.map(o => {
            if (o.ref !== ref) return o
            const isPartial = partialItems && partialItems.length > 0 && partialItems.length < o.items.length
            const newFulfillmentStatus = isPartial ? 'Partially Cancelled' : 'Cancelled'
            const newPaymentStatus = refundAmount > 0
                ? (refundAmount >= o.total ? 'Refunded' : 'Partially Refunded')
                : o.paymentStatus

            const refundEntry = {
                id: `RF-${Date.now()}`,
                amount: refundAmount || 0,
                method: 'Original Payment Method',
                reason,
                at,
                items: partialItems || [],
            }

            const newEvents = [
                ...(o.events || []),
                mkEvent(Date.now(), at, 'cancelled', o.fulfillmentStatus, newFulfillmentStatus,
                    `${isPartial ? 'Partial cancel' : 'Cancelled'}: ${reason}. Refund: $${(refundAmount || 0).toFixed(2)}.`),
                mkEvent(Date.now() + 1, at, 'customer_notified', '', '', 'Customer notified of cancellation via email.'),
            ]
            return {
                ...o,
                fulfillmentStatus: newFulfillmentStatus,
                status: deriveStatus(newFulfillmentStatus),
                paymentStatus: newPaymentStatus,
                cancelReason: reason,
                cancelMessage: message,
                cancelledItems: isPartial ? partialItems : o.items,
                refundedAmount: (o.refundedAmount || 0) + (refundAmount || 0),
                refundedAt: at,
                refundHistory: [...(o.refundHistory || []), refundEntry],
                events: newEvents,
            }
        }))
    }

    /* ── issueRefund: standalone refund action ── */
    const issueRefund = (ref, { amount, method, reason, items }) => {
        const at = new Date().toISOString()
        setOrders(prev => prev.map(o => {
            if (o.ref !== ref) return o
            const refundEntry = {
                id: `RF-${Date.now()}`,
                amount,
                method,
                reason,
                at,
                items: items || [],
            }
            const newRefundedAmount = (o.refundedAmount || 0) + amount
            const newPaymentStatus = newRefundedAmount >= o.total ? 'Refunded' : 'Partially Refunded'
            const newEvents = [
                ...(o.events || []),
                mkEvent(Date.now(), at, 'customer_notified', '', '', `Refund of $${amount.toFixed(2)} issued via ${method}. Reason: ${reason}.`),
            ]
            return {
                ...o,
                paymentStatus: newPaymentStatus,
                refundedAmount: newRefundedAmount,
                refundedAt: at,
                refundHistory: [...(o.refundHistory || []), refundEntry],
                events: newEvents,
            }
        }))
    }

    const sendCustomerMessage = (ref, { subject, body }) => {
        const at = new Date().toISOString()
        _addEvent(ref, mkEvent(Date.now(), at, 'customer_notified', '', '', `Email sent: "${subject}"`))
    }

    /* ── Blogs ── */
    const updateBlog = (id, data) =>
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, ...data } : b))
    const deleteBlog = (id) =>
        setBlogs(prev => prev.filter(b => b.id !== id))

    /* ── Stats ── */
    const stats = {
        totalRevenue:    orders.filter(o => deriveStatus(o.fulfillmentStatus) !== 'Cancelled').reduce((s, o) => s + o.total, 0),
        totalOrders:     orders.length,
        activeOrders:    orders.filter(o => ['Processing','Shipped'].includes(deriveStatus(o.fulfillmentStatus))).length,
        totalCustomers:  customers.length,
        totalProducts:   inventory.length,
        lowStock:        inventory.filter(p => p.stock > 0 && p.stock <= 5).length,
        outOfStock:      inventory.filter(p => p.stock === 0).length,
        completedOrders: orders.filter(o => deriveStatus(o.fulfillmentStatus) === 'Completed').length,
    }

    return (
        <AdminContext.Provider value={{
            adminUser, isAdminLoggedIn, adminLogin, adminLogout,
            inventory, updateProduct, addProduct, deleteProduct,
            orders,
            updateOrderStatus, addOrderNote,
            updateFulfillmentStatus, addEvent, addTrackingNumber,
            markPacked, markShipped, markDelivered, cancelOrder, issueRefund, sendCustomerMessage,
            customers,
            blogs, updateBlog, deleteBlog,
            stats,
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => {
    const ctx = useContext(AdminContext)
    if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
    return ctx
}

export default AdminContext
