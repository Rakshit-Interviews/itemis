import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { Category, Item } from 'src/app/classes/app.constant';
import { UploadService } from 'src/app/services/upload-service.service';


@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    currentItem: any = '0'
    quantityForm: number = 1

    @ViewChild('myModal') myModal!: TemplateRef<any>;
    @ViewChild('bulkUpload') uploadModal!: TemplateRef<any>;

    display: boolean = false

    items: Item[] = []

    currentItems: Item[] = []

    selectedItem!: Item
    form!: FormGroup

    constructor(private mdbService: NgbModal, private uploadService: UploadService, private fb: FormBuilder) {

    }

    updateItem() {
        this.display = true
        this.selectedItem = this.items.filter(t => t.id === this.currentItem)[0]
        this.selectedItem.quantity = 1
        console.log(this.selectedItem)
    }

    ngOnInit(): void {
        this.form = this.fb.group({ importCsv: ['', Validators.required] })
        this.getAllItems()
    }

    async getAllItems() {
        try {
            let data = await firstValueFrom(this.uploadService.getAllItems())
            this.items = (data[0].data as Item[])
        } catch (e) {
            console.error(e)
        }
    }

    openModal() {
        this.selectedItem = new Item()
        this.display = false
        this.currentItem = '0'
        this.mdbService.open(this.myModal)
    }

    openUploadModal() {
        this.mdbService.open(this.uploadModal)
    }

    getPrice(price: any, quantity: any) {
        return (parseFloat(price) * parseInt(quantity)).toFixed(3)
    }

    addItem() {
        this.selectedItem.quantity = this.quantityForm
        if (this.currentItems.map(t => t.id).includes(this.selectedItem.id)) {
            for (let item of this.currentItems) {
                if (item.id == this.selectedItem.id) {
                    item.quantity += this.selectedItem.quantity
                }
            }
        } else {
            this.currentItems.push({ ...this.selectedItem })
        }
    }

    deleteItem(item: Item) {
        this.currentItems = this.currentItems.filter(t => t.id !== item.id)
    }

    async onFileSelected(event: any) {
        const file: File = event.target.files[0];

        if (file) {
            await firstValueFrom(this.uploadService.uploadData(file))
            setTimeout(()=> this.getAllItems(), 500)
        }
    }

    async uploadDataToDb() {
        const file = this.form.value["importCsv"]
        console.log(file)
    }

    getSalesTax() {
        let tax: number = 0
        for (let item of this.currentItems) {
            tax += parseFloat(this.getTax(item))
            item.totalPrice = parseFloat(item.price) + parseFloat(this.getTax(item))
        }
        return tax
    }

    getTax(item: Item): string {
        if (item.category == Category.BOOKS || item.category == Category.FOOD || item.category == Category.MEDICINE) {
            return '0'
        } else {
            let tax: number = 0
            if (item.category == Category.OTHERS) {
                tax += parseFloat(item.price) * 0.1
            }
            if (item.imported) {
                tax += parseFloat(item.price) * 0.05
            }
            return (Math.ceil(tax * 20) / 20).toFixed(2)
        }
    }

    getTotalPrice() {
        return (this.currentItems.map(t => t.totalPrice).reduce((acc, curr) => acc + curr, 0.0)).toFixed(2)
    }
}
