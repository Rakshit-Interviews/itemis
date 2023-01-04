export const url: string = 'http://localhost/api/'

export class Item {
    id!: string
    name!: string
    price!: string
    category!: string
    quantity!: number
    totalPrice!: number
    imported?: boolean
}

export enum Category {
    BOOKS = "Books", FOOD = "Food", IMPORTED = "Imported", MEDICINE = "Medical", OTHERS = "Others"
}