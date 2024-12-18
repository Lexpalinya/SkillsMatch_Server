import { Redis } from "ioredis/built";


const redis = new Redis();


redis.on("connect", () => {
    console.log('Connected on Redis')
})


redis.on("error", () => {
    console.log('Error connecting redis')
})



export default redis