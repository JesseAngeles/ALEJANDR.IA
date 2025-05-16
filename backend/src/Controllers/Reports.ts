import { Request, Response } from "express"
import Order from "../Models/Order"

export const Sales = async (req: Request, res: Response): Promise<void> => {
    try {
        const { from, to, groupBy } = req.query;

       const dateFilter = (from && to)
  ? {
      date: {
        $gte: new Date(from as string),
        $lte: new Date(to as string),
      },
    }
  : {};


        const orders = await Order.find(dateFilter)

        const totalValues = orders.map(order => order.total as number)
        const totalSum = totalValues.reduce((acc, val) => acc + val, 0)
        const totalCount = totalValues.length
        const average = totalCount > 0 ? totalSum / totalCount : 0

        // Agrupación para gráfico
        let groupStage: any = {}
        let sortStage: any = {}

        if (groupBy === 'day') {
            groupStage = {
                year: { $year: "$date" },
                month: { $month: "$date" },
                day: { $dayOfMonth: "$date" }
            }
            sortStage = { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        } else if (groupBy === 'month') {
            groupStage = {
                year: { $year: "$date" },
                month: { $month: "$date" }
            }
            sortStage = { "_id.year": 1, "_id.month": 1 }
        } else if (groupBy === 'year') {
            groupStage = {
                year: { $year: "$date" }
            }
            sortStage = { "_id.year": 1 }
        }

        let chartData: any = []

        if (groupBy) {
            chartData = await Order.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: groupStage,
                        count: { $sum: 1 }
                    }
                },
                { $sort: sortStage }
            ])

            // Formato de fecha
            chartData = chartData.map((entry: { _id: { year: any; month: any; day: any }; count: any }) => {
                const { year, month, day } = entry._id
                let label = `${year}`
                if (month) label += `-${month.toString().padStart(2, '0')}`
                if (day) label += `-${day.toString().padStart(2, '0')}`
                return {
                    date: label,
                    sales: entry.count
                }
            })
        }

        res.status(200).json({
            count: totalCount,
            totalSum,
            average,
            totalValues,
            chartData
        })
    } catch (error) {
        console.error(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const Books = async (req: Request, res: Response): Promise<void> => {
    try {
        const booksSold = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.bookId",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            {
                $lookup: {
                    from: "books",           
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookData"
                }
            },
            { $unwind: "$bookData" }, 
            {
                $project: {
                    _id: 0,
                    title: "$bookData.title",
                    author: "$bookData.author",
                    quantity: "$totalSold"
                }
            },
            { $sort: { quantity: -1 } }
        ])

        res.status(200).json({ books: booksSold })
    } catch (error) {
        console.error(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const Clients = async (req: Request, res: Response): Promise<void> => {
    try {
        const clients = await Order.aggregate([
            {
                $group: {
                    _id: "$client", 
                    orders: { $sum: 1 },   
                    totalSpent: { $sum: "$total" } 
                }
            },
            {
                $lookup: {
                    from: "users",  
                    localField: "_id",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            { $unwind: "$userData" }, 
            {
                $project: {
                    _id: 0,
                    name: "$userData.name",
                    email: "$userData.email",
                    orders: 1,
                    totalSpent: 1
                }
            },
            { $sort: { totalSpent: -1 } }
        ])

        res.status(200).json({ clients })
    } catch (error) {
        console.error(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const State = async (req: Request, res: Response): Promise<void> => {
    try {
        const stateData = await Order.aggregate([
            { $unwind: "$items" }, 
            {
                $group: {
                    _id: "$state",                      
                    count: { $sum: "$items.quantity" }   
                }
            },
            {
                $project: {
                    _id: 0,
                    state: "$_id",
                    count: 1
                }
            }
        ])

        res.status(200).json({ states: stateData })
    } catch (error) {
        console.error(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}
