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



        // # 구매하기 -> 구매 내역 출력
        $("#buy-modal form").on("submit", e => {
            e.preventDefault();
            $("#buy-modal").modal('hide');
            const now = new Date();

            const padding = 30;
            const textGap = 10;
            const titleGap = 50;
            const fontSize = 15;
            const titleSize = 20;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            
            canvas.width = 450;
            canvas.height = padding * 2 + titleSize + titleGap;

            let w_cursor = padding + titleSize + titleGap;
            let drawList = [];
            let purchaseList = this.cartList.map(item => ({key: item.init_data.product_name, value: `${item.price.toLocaleString()} × ${item.buyCount} = ${(item.price * item.buyCount).toLocaleString()}`}));
            let totalPrice = this.cartList.reduce((p, c) => p + c.buyCount * c.price, 0);
            [
                ...purchaseList,
                {key: "구매일시", value: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`},
                {key: "총 합계", value: "￦ " + totalPrice.toLocaleString()},
            ].forEach(({key, value}) => {
                ctx.font = `${fontSize}px 나눔스퀘어, sans-serif`;
                let ms = ctx.measureText(value);
                let x = canvas.width - padding - ms.width;
                let y = w_cursor;

                w_cursor += fontSize + textGap;

                drawList.push({key, value, x, y});
            });
            canvas.height = w_cursor + padding;


            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#d6912a";
            ctx.font = `${titleSize}px 나눔스퀘어, sans-serif`;
            ctx.fillText("구매 내역", padding, padding + titleSize);


            drawList.forEach(({key, value, x, y}) => {
                ctx.font = `${fontSize}px 나눔스퀘어, sans-serif`;
                ctx.fillStyle = "#333";
                
                ctx.fillText(key, padding, y);
                ctx.fillText(value, x, y);
            });

            const src = canvas.toDataURL('image/jpeg');
            $("#purchase-modal img").attr("src", src);
            $("#purchase-modal").modal('show');
        });
    }
}