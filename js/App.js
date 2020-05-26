class App {
    cartList = [];
    constructor(){
        this.$storeBox = $("#store-box");
        this.$cartBox = $("#cart-box");

        this.init();
        this.setEvent();
    }

    async init(){
        this.products = await this.getProducts();
        
        this.updateStore();
        this.updateCart();
    }

    updateStore(){
        let viewList = this.products;
        viewList.forEach(product => product.init());

        this.$storeBox.html("");
        if(viewList.length > 0){
            viewList.forEach(product => {
                product.updateStore();
                this.$storeBox.append(product.$storeElem);
            });
        }
        else {
            this.$storeBox.html("<div class='text-center py-5 text-muted'>일치하는 상품이 없습니다.</div>");
        }
    }

    updateCart(){
        let total = this.cartList.reduce((p, c) => p + c.buyCount * c.price, 0);

        this.$cartBox.html("");
        if(this.cartList.length > 0)
            this.cartList.forEach(item => {
                item.updateCart();
                this.$cartBox.append(item.$cartElem);
            });
        else
            this.$cartBox.html("<p class='text-center text-muted py-5'>장바구니에 담긴 상품이 없습니다.</p>");
        
        $(".total-price").text(total.toLocaleString());
    }
    
    getProducts(){
        return fetch("/store/data.json")
            .then(res => res.json())
            .then(jsonList => jsonList.map(jsonData => new Product(this, jsonData)));
    }

    setEvent(){
        // # 드래그 앤 드롭
        let dragItem;
        this.$storeBox.on("dragstart", ".store-item .image", e => {
            let id = $(e.currentTarget).data("id");
            dragItem = this.products.find(product => product.id == id);
        });

        $(".drop-area").on("dragover", e => e.preventDefault());
        $(".drop-area").on("drop", e => {
            
            if(this.cartList.some(item => item == dragItem)){
                alert("이미 장바구니에 담긴 상품입니다.");
            } else {
                dragItem.buyCount = 1;
                dragItem.updateCart.call(dragItem);
                this.cartList.push(dragItem);
                this.updateCart();
            }           
        });


        // # 장바구니 개수
        this.$cartBox.on("input", ".buyCount", e => {
            let id = $(e.target).data("id");
            let product = this.products.find(prod => prod.id == id);
            product.buyCount = parseInt(e.target.value);
            this.updateCart();
            e.target.focus();
        });


        // # 장바구니 삭제
        this.$cartBox.on("click", ".close-btn", e => {
            let id = $(e.target).data("id");
            let idx = this.cartList.findIndex(prod => prod.id == id);

            if(idx >= 0){
                let product = this.cartList[idx];
                product.buyCount = 0;
                this.cartList.splice(idx, 1);
                this.updateCart();
            }
        });



        $(".buy-btn").on("click", e => {
                
        });
    }
}