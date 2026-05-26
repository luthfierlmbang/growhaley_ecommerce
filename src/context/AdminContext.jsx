import React, { createContext, useContext, useState } from 'react'
import { dataBlog } from '../data/blogs'

const AdminContext = createContext(null)

const ADMIN_CREDENTIALS = { email: 'admin@lux.com', password: 'lux2025', name: 'Admin Lux' }

/* ── Seed inventory from existing product data ── */
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

/* ── Seed mock orders ── */
const seedOrders = () => {
    const statuses  = ['Completed', 'Processing', 'Shipped', 'Cancelled']
    const methods   = ['DHL', 'FedEx']
    const payments  = ['PayPal', 'Apple Pay', 'Credit Card']
    const names     = ['James Lipshutz', 'Giana Dokidis', 'Jordyn Botosh', 'Kierra Bergson', 'Cooper Korsgaard', 'Jaydon Bergson']
    const addresses = [
        { street: '1536 Stellar Dr', city: 'Kenai', region: 'Alaska', postal: '99611', country: 'USA', phone: '(907) 283-6173' },
        { street: '2336 Jack Warren Rd', city: 'Delta Junction', region: 'Alaska', postal: '99737', country: 'USA', phone: '(907) 895-4411' },
        { street: '88 Pine Street', city: 'New York', region: 'New York', postal: '10005', country: 'USA', phone: '(212) 555-0198' },
        { street: '450 Sunset Blvd', city: 'Los Angeles', region: 'California', postal: '90028', country: 'USA', phone: '(323) 555-0147' },
        { street: '77 Wacker Dr', city: 'Chicago', region: 'Illinois', postal: '60601', country: 'USA', phone: '(312) 555-0122' },
        { street: '300 Boylston St', city: 'Boston', region: 'Massachusetts', postal: '02116', country: 'USA', phone: '(617) 555-0133' },
    ]
    const trackingNums = ['1Z999AA10123456784', '9400111899223397658', '7489023641', '1Z12345E0205271688', '9261290100830049000', '1Z9999999999999999']
    const items = [
        [{ name: 'Winter Coat',    price: '144.99', qty: 1, img: '/images/p (2).png', selectedSize: 'M',  selectedColor: '#CDBF9A', colorName: 'Beiges' }],
        [{ name: 'Autumn Dress',   price: '124.99', qty: 2, img: '/images/p (3).png', selectedSize: 'S',  selectedColor: '#D574B2', colorName: 'Roses' }],
        [{ name: 'Casual T-Shirt', price: '39.99',  qty: 3, img: '/images/p (1).png', selectedSize: 'L',  selectedColor: '#171717', colorName: 'Black' }],
        [{ name: 'Slim Jeans',     price: '89.99',  qty: 1, img: '/images/p (2).png', selectedSize: 'M',  selectedColor: '#614126', colorName: 'Browns' }],
        [{ name: 'Denim Jacket',   price: '159.99', qty: 1, img: '/images/p (3).png', selectedSize: 'XL', selectedColor: '#838382', colorName: 'Gray' }],
        [{ name: 'Sneakers Pro',   price: '119.99', qty: 2, img: '/images/p (1).png', selectedSize: '42', selectedColor: '#171717', colorName: 'Black' }],
    ]
    return Array.from({ length: 18 }, (_, i) => {
        const itemSet  = items[i % items.length]
        const total    = itemSet.reduce((s, it) => s + parseFloat(it.price) * it.qty, 0)
        const daysAgo  = Math.floor(Math.random() * 30)
        const d        = new Date(); d.setDate(d.getDate() - daysAgo)
        const status   = statuses[i % statuses.length]
        const stepIdx  = status === 'Completed' ? 4 : status === 'Shipped' ? 2 : status === 'Processing' ? 1 : status === 'Cancelled' ? -1 : 0
        return {
            ref:            `LUX-${String(1000 + i).padStart(4, '0')}`,
            customer:       names[i % names.length],
            email:          `customer${i + 1}@email.com`,
            phone:          addresses[i % addresses.length].phone,
            address:        addresses[i % addresses.length],
            items:          itemSet,
            total:          parseFloat(total.toFixed(2)),
            subtotal:       parseFloat(total.toFixed(2)),
            discount:       0,
            shippingCost:   methods[i % methods.length] === 'FedEx' ? 0.88 : 0,
            status,
            shippingMethod: methods[i % methods.length],
            paymentMethod:  payments[i % payments.length],
            trackingNumber: status === 'Shipped' || status === 'Completed' ? trackingNums[i % trackingNums.length] : null,
            deliveryStep:   stepIdx,
            date:           d.toISOString(),
            cancelReason:   status === 'Cancelled' ? 'Item out of stock' : null,
            cancelMessage:  status === 'Cancelled' ? 'We apologize, your order has been cancelled due to stock unavailability. A full refund has been initiated.' : null,
            notes:          [],
        }
    })
}

/* ── Seed customers ── */
const seedCustomers = () => [
    { id: 1, name: 'James Lipshutz',  email: 'james@email.com',   orders: 5, totalSpent: 724.95, joined: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Giana Dokidis',   email: 'giana@email.com',   orders: 3, totalSpent: 374.97, joined: '2024-02-20', status: 'Active' },
    { id: 3, name: 'Jordyn Botosh',   email: 'jordyn@email.com',  orders: 8, totalSpent: 1199.92, joined: '2023-11-05', status: 'Active' },
    { id: 4, name: 'Kierra Bergson',  email: 'kierra@email.com',  orders: 2, totalSpent: 249.98, joined: '2024-03-10', status: 'Active' },
    { id: 5, name: 'Cooper Korsgaard',email: 'cooper@email.com',  orders: 1, totalSpent: 144.99, joined: '2024-04-01', status: 'Active' },
    { id: 6, name: 'Jaydon Bergson',  email: 'jaydon@email.com',  orders: 0, totalSpent: 0,      joined: '2024-05-12', status: 'Inactive' },
]

export const AdminProvider = ({ children }) => {
    const [adminUser, setAdminUser]     = useState(null)
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
    const [inventory, setInventory]     = useState(seedInventory())
    const [orders, setOrders]           = useState(seedOrders())
    const [customers]                   = useState(seedCustomers())
    const [blogs, setBlogs]             = useState(dataBlog.map((b, i) => ({ ...b, id: i + 1, status: 'Published', views: Math.floor(Math.random() * 500 + 50) })))

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

    /* ── Orders ── */
    const updateOrderStatus = (ref, status, extra = {}) =>
        setOrders(prev => prev.map(o => o.ref === ref ? { ...o, status, ...extra } : o))

    const addOrderNote = (ref, note) =>
        setOrders(prev => prev.map(o => o.ref === ref ? { ...o, notes: [...(o.notes || []), note] } : o))

    /* ── Blogs ── */
    const updateBlog = (id, data) =>
        setBlogs(prev => prev.map(b => b.id === id ? { ...b, ...data } : b))
    const deleteBlog = (id) =>
        setBlogs(prev => prev.filter(b => b.id !== id))

    /* ── Stats ── */
    const stats = {
        totalRevenue:  orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0),
        totalOrders:   orders.length,
        activeOrders:  orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length,
        totalCustomers: customers.length,
        totalProducts:  inventory.length,
        lowStock:       inventory.filter(p => p.stock > 0 && p.stock <= 5).length,
        outOfStock:     inventory.filter(p => p.stock === 0).length,
        completedOrders: orders.filter(o => o.status === 'Completed').length,
    }

    return (
        <AdminContext.Provider value={{
            adminUser, isAdminLoggedIn, adminLogin, adminLogout,
            inventory, updateProduct, addProduct, deleteProduct,
            orders, updateOrderStatus, addOrderNote,
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
