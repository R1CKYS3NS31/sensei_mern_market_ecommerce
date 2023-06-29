import React from 'react'
import { Link, Route, Routes } from "react-router-dom";

// pages
import { Home } from "./pages/Home";
import { Users } from './components/user/Users';
import { Signup } from './components/user/Signup';
import { Signin } from './components/auth/Signin';
import { Profile } from './components/user/Profile';
import { EditProfile } from './components/user/EditProfile';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { Product } from './pages/product/Product';
import { Cart } from './pages/cart/Cart';
import { EditProduct } from './pages/product/EditProduct';
import Shops from './pages/shop/Shops';
import { Shop } from './pages/shop/Shop';
import { MyShops } from './pages/shop/MyShops';
import { NewShop } from './pages/shop/NewShop';
import { EditShop } from './pages/shop/EditShop';
import { NewProduct } from './pages/product/NewProduct';
import { Order } from './pages/order/Order';
import { ShopOrders } from './pages/order/ShopOrders';
import StripeConnect from './components/user/StripeConnect';
import { MyAuctions } from './pages/auction/MyAuctions';
import { NewAuction } from './pages/auction/NewAuction';
import { EditAuction } from './pages/auction/EditAuction';
import { Auction } from './pages/auction/Auction';
import { OpenAuctions } from './pages/auction/OpenAuctions';


export const MainRouter = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
                // element={!user ? <SignInSide /> : <Home user={user} />}
                exact
            />
            {/* <Route
                path="/users"
                element={<Users />}
                // element={!user ? <SignInSide /> : <Home user={user} />}
                
            /> */}
            <Route path="/users" element={<Users />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/user/edit/:userId/*" element={<PrivateRoute component={EditProfile} />} />
            <Route path="/user/:userId" element={<Profile />} />

            <Route path="/cart" component={<Cart />} />
            <Route path="/product/:productId" component={<Product />} />
            <Route path="/shops/all" component={<Shops />} />
            <Route path="/shops/:shopId" component={<Shop />} />

            <Route path="/order/:orderId" component={<Order />} />
            <Route path="/seller/orders/:shop/:shopId" element={<PrivateRoute component={ShopOrders} />} />

            <Route path="/seller/shops" element={<PrivateRoute component={MyShops} />} />
            <Route path="/seller/shop/new" element={<PrivateRoute component={NewShop} />} />
            <Route path="/seller/shop/edit/:shopId" element={<PrivateRoute component={EditShop} />} />
            <Route path="/seller/:shopId/products/new" element={<PrivateRoute component={NewProduct} />} />
            <Route path="/seller/:shopId/:productId/edit" element={<PrivateRoute component={EditProduct} />} />

            <Route path="/seller/stripe/connect" component={<StripeConnect />} />
            <Route path="/myauctions" element={<PrivateRoute component={MyAuctions} />} />
            <Route path="/auction/new" element={<PrivateRoute component={NewAuction} />} />
            <Route path="/auction/edit/:auctionId" element={<PrivateRoute component={EditAuction} />} />
            <Route path="/auction/:auctionId" component={Auction}/>
            <Route path="/auctions/all" component={OpenAuctions}/>

            {/* no route */}
            <Route
                path="*"
                element={
                    <main
                        style={{
                            padding: "1rem",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <h1>There's nothing here!</h1>
                        <Link to={"/"}>
                            <button
                                style={{
                                    textDecoration: "none",
                                    border: "none",
                                    width: 120,
                                    borderRadius: 5,
                                    padding: "20px",
                                    backgroundColor: "black",
                                    color: "white",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                }}
                            >
                                Go Back Home
                            </button>
                        </Link>
                    </main>
                }
            />
        </Routes>
    )
}
