class Product {
    buyCount = 0;

    constructor(app, init_data){
        init_data.price = parseInt(init_data.price.replace(/[^0-9]/g, ""));
        this.init_data = init_data;

        this.app = app;

        this.init();
        this.updateStore();
        this.updateCart();
    }

    init(){
        let {id, photo, brand, product_name, price} = this.init_data;

        this.id = id;
        this.photo = photo;
        this.brand = brand;
        this.product_name = product_name;
        this.price = price;
    }

    updateStore(){
        let {id, photo, brand, product_name, price} = this;

        if(!this.$storeElem){
            let html = `<div class="col-lg-4 col-md-6 mb-5">
                            <div class="store-item">
                                <div class="image" data-id="${id}" draggable="draggable">
                                    <img class="fit-cover" src="./store/images/${photo}" title="상품 이미지" alt="상품 이미지">
                                </div>
                                <div class="d-between align-items-end mt-3 px-2">
                                    <div class="text-black">
                                        <div class="text-muted fx-n1 brand">${brand}</div>
                                        <div class="fx-3 font-weight-bold product_name">${product_name}</div>
                                    </div>
                                    <div class="text-deepgold">
                                        <span class="text-muted fx-2 mr-2">￦</span>
                                        <span class="fx-5">${price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>`;           
            this.$storeElem = $(html);
        } else {
            this.$storeElem.find(".brand").html(brand);
            this.$storeElem.find(".product_name").html(product_name);
        }
    }

    updateCart(){
        let {id, photo, brand, product_name, price} = this;
        let total = (price * this.buyCount).toLocaleString()

        if(!this.$cartElem){
            let html = `<div class="table-row">
                            <div class="cell-10">
                                ${id}
                            </div>
                            <div class="cell-40">
                                <div class="text-left d-flex align-items-center p-3">
                                    <img class="table-image" src="store/images/${photo}" title="상품 이미지" alt="상품 이미지">
                                    <div class="ml-4">
                                        <div class="text-muted fx-n4">${brand}</div>
                                        <div class="fx-3 mt-1 font-weight-bold">${product_name}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="cell-15">
                                <small class="text-muted">￦</small>
                                <span class="price">${price.toLocaleString()}</span>
                            </div>
                            <div class="cell-15">
                                <input type="number" min="0" class="buyCount" value="${this.buyCount.toLocaleString()}" data-id="${this.id}">
                            </div>
                            <div class="cell-15">
                                <span class="text-muted">￦</span>
                                <span class="fx-2 text-deepgold font-weight-bold total">${total}</span>
                            </div>
                            <div class="cell-auto">
                                <button class="close-btn border-none bg-none text-muted" data-id="${id}">
                                    &times;
                                </button>
                            </div>
                        </div>`;
            this.$cartElem = $(html);
        } else {
            this.$cartElem.find(".buyCount").val(this.buyCount);
            this.$cartElem.find(".total").text(total);
        }
    }
}