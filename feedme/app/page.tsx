"use client";

import { Button } from "@/components/ui/button"
import { regularQueue, vipQueue, workingBots } from '@/lib/orderData';
import { useEffect, useState } from 'react';

let orderId = 1;
let bots = 0;

export default function Home() {
  const [regularList, setRegularList] = useState([...regularQueue]);
  const [vipList, setVipList] = useState([...vipQueue]);
  const [workingBotsList, setWorkingBotsList] = useState([...workingBots]);
  const [customerType, setCustomerType] = useState<'Regular' | 'VIP'>('Regular');

  useEffect(() => {
    const interval = setInterval(() => {
      setVipList([...vipQueue]); // trigger re-render
      setRegularList([...regularQueue]); // trigger re-render
    }, 500); // or shorter if you want more real-time

    return () => clearInterval(interval); // clean up
  }, []);
  

  const makeAnOrder = () => {
    const newOrder = {
      id: orderId++, 
      customerType: customerType,
      status: "Pending"
    }
    if (customerType === 'VIP') {
      vipQueue.push(newOrder);
      setVipList([...vipQueue]);
    }
    else {
      regularQueue.push(newOrder);
      setRegularList([...regularQueue]);
    }
    kitchenProcess();
  }

  const currentPriority = () => {
    let pendingVip = vipQueue.filter(o => o.status === 'Pending');
    if (pendingVip.length > 0) {
      return pendingVip[0];
    }
    else {
      let pendingRegular = regularQueue.filter(o => o.status === 'Pending');
      if (pendingRegular.length > 0) {
        return pendingRegular[0];
      }
    }
    return null;
  }

  const addBot = () => {
    const newWorkingBots = {
      id: bots++,
      customer: currentPriority(),
      timer: 0
    }
    workingBots.push(newWorkingBots);
    setWorkingBotsList([...workingBots]);
    kitchenProcess();
  }

  const removeBot = () => {
    if (workingBots.length > 0) {
      workingBots.pop();
      setWorkingBotsList([...workingBots]);
      bots--;
      kitchenProcess();
    }
  }

  const kitchenProcess = () => {
    console.log("Cooking");

    if (workingBots.length <= 0) {
      console.log("Kitchen is off!");
    }
    else {
      const timer = setTimeout(() => {
        Object.entries(workingBots).forEach(([botId, bot]) => {
          if (bot.customer != null) {
            if (bot.timer < 10) {
              workingBots[bot.id].timer = bot.timer+1;
            }
            else {
              const customer = bot.customer;
              if (customerType === 'VIP') {
                const index = vipQueue.findIndex(o => o.id === customer?.id);
                if (index !== -1) {
                  vipQueue[index].status = 'Completed';
                  setVipList([...vipQueue]);
                  console.log(vipQueue);
                }
              }
              else {
                const index = regularQueue.findIndex(o => o.id === customer?.id);
                if (index !== -1) {
                  regularQueue[index].status = 'Completed';
                  setRegularList([...regularList]);
                  console.log(regularQueue);
                }
              }
              workingBots[bot.id].customer = currentPriority();
              workingBots[bot.id].timer = 0;
            }
          }
          else {
            workingBots[bot.id].customer = currentPriority();
            workingBots[bot.id].timer = 0;
          }
          console.log(workingBots);
        })
        setWorkingBotsList([...workingBots]);

        kitchenProcess();
      }, 1000);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1">
          <div className="text-2xl bg-red-500 p-2">Welcome to <span className="text-yellow-400">McDonald</span>!</div>
          <div className="flex flex-row p-2">
            <div className="flex flex-col flex-1 text-sm pr-2">
              <div className="text-yellow-400">How would you like to order?</div>
              <div>
                <input
                  type="radio"
                  name="customerType"
                  value="Regular"
                  checked={customerType === 'Regular'}
                  onChange={() => setCustomerType('Regular')}
                /> Regular Customer
              </div>
              <div>
                <input
                  type="radio"
                  name="customerType"
                  value="VIP"
                  checked={customerType === 'VIP'}
                  onChange={() => setCustomerType('VIP')}
                /> VIP Customer
              </div>
              <div className="mt-2">
                <Button variant="outline" className="bg-yellow-400" onClick={makeAnOrder}>Order Now!</Button>
              </div>
            </div>
            <div className="flex flex-col flex-1 text-sm">
              <div className="text-yellow-400">Kitchen</div>
              <div className="">Cooking Bots: <Button variant="outline" className="bg-red-500 text-white" onClick={removeBot}>-</Button> <span className="px-3">{bots}</span> <Button variant="outline" className="bg-red-500 text-white" onClick={addBot}>+</Button></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 pt-2">
        <div className="text-2xl bg-yellow-400 p-2">Serving Board</div>
        <div className="flex flex-row">
          <div className="flex flex-col flex-1 p-2">
            <div className="text-red-500">Pending</div>
            <ul className="pt-2">
              {
                vipList.filter(order => order.status === 'Pending').map(pendingOrder => (
                  <li key={pendingOrder.id} className="p-2 bg-yellow-400">
                    {pendingOrder.customerType} #{pendingOrder.id}
                  </li>
                ))
              }
              {
                regularList.filter(order => order.status === 'Pending').map(pendingOrder => (
                  <li key={pendingOrder.id} className="p-2">
                    {pendingOrder.customerType} #{pendingOrder.id}
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="flex flex-col flex-1 p-2">
            <div className="text-yellow-400">Completed</div>
            <ul className="pt-2">
              {
                vipList.filter(order => order.status === 'Completed').map(completeOrder => (
                  <li key={completeOrder.id} className="p-2 bg-yellow-400">
                    {completeOrder.customerType} #{completeOrder.id}
                  </li>
                ))
              }
              {
                regularList.filter(order => order.status === 'Completed').map(completeOrder => (
                  <li key={completeOrder.id} className="p-2">
                    {completeOrder.customerType} #{completeOrder.id}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
