import React from 'react'
import { CartItemContainer } from '../CartItem'
export const CartItemListDisplay = ({items, fetched})=>{
    console.log("I got here", fetched);
    return <div>
    {fetched ? <div>
            {items.map(item=>(
                <CartItemContainer {...item.toJS()} key={item.get(`id`)}/>
            ))}
        </div> :
        <div>
            Please wait...
        </div>
    }
    </div>}
;