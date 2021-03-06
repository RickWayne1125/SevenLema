let card_list = [], total_price = 0, total_amount = 0, serving = false, pager;

function change_dish_info() {
    let data = new FormData(document.getElementById('dish-form'));
    $.each(['name', 'price', 'desc'], (_, key) => !data.get(key).length && data.delete(key));
    data.append('serving', $('#dish-serving:checked').length !== 0 ? 'true' : 'false');
    $.ajax({
        url: '/dish/edit/',
        data: data,
        processData: false,
        contentType: false,
        type: 'post',
        success: (resp) => resp.code ? alert(resp.msg) : ($('#dish-modal').modal('hide') & load_dish())
    });
}

function commit_an_order() {
    let dish_id_list = [], dish_amount = [];
    for (let i = 0; i < card_list.length; i++) {
        dish_id_list[i] = card_list[i].dish_id;
        dish_amount [i] = card_list[i].amount;
    }
    const data = {
        shop_id: shop_id,
        dish_id: dish_id_list,
        amount: dish_amount,
        addr: $('#addr').val(),
        loc_lng: locator.lng(),
        loc_lat: locator.lat(),
        remarks: $('#remarks').val()
    };
    const button = $(this);
    miscellaneous.loadingButton(button);
    miscellaneous.web.post('/order/new/', data,
        () => window.location.href = '/orders/',
        () => miscellaneous.loadingButton(button));
}

function amount_change(dish_id) {
    const input = $('#dish-' + dish_id);
    let changed_amount = Number(input.val());
    if (changed_amount <= 0) {
        $.each(card_list, (i, card) => {
            if (dish_id === card.dish_id) {
                render_price_and_amount(-card.price * card.amount, -card.amount);
                card_list.splice(i, 1);
                miscellaneous.animate(input.parents('.card'), 'fadeOutRight', (target) => {
                    miscellaneous.animate($('#card-list-container').children().slice(i + 1), 'slideInUp');
                    target.remove();
                });
                return false;
            }
        });
    } else {
        if (changed_amount % 1 !== 0) {
            changed_amount = Number(changed_amount.toFixed(0));
        }
        $.each(card_list, (i, card) => {
            if (dish_id === card.dish_id) {
                const delta = changed_amount - card.amount;
                render_price_and_amount(card.price * delta, delta);
                card.amount = changed_amount;
                return false;
            }
        });
    }
    !card_list.length && $('#submit-order').attr('disabled', 'disabled');
    input.val(changed_amount);
}

function add_dish_to_card(name, dish_id, image, price) {
    console.log(dish_id, price);
    card_list.length === 0 && $('.alert').length === 0 && $('#submit-order').removeAttr('disabled');
    render_price_and_amount(price, 1);
    for (let i = 0; i < card_list.length; i++) {
        if (card_list[i].dish_id === dish_id) {
            $('#dish-' + dish_id).val(++card_list[i].amount);
            return;
        }
    }
    const new_card = [{
        name: name,
        dish_id: dish_id,
        image: image,
        price: price,
        amount: 1
    }];
    card_list = card_list.concat(new_card);
    miscellaneous.loadTemplate($('#card-list-container'), $('#card-list-template'), new_card, true);
}

function render_price_and_amount(price, amount) {
    total_price += price;
    total_amount += amount;
    $('.badge').text(total_amount ? total_amount : '');
    $('#total-price').val('总价：￥' + total_price.toFixed(2));
}

function load_dish() {
    const data = {
        shop_id: shop_id,
        name: $('#header-search').val(),
        order: get_order(),
        page: pager.currentPage(),
        limit: pager.limit(),
        serving: serving
    };
    miscellaneous.web.get('/search/dish/', data, (resp) => {
        pager.maximumPage(resp.page);
        miscellaneous.loadTemplate($('#data-container'), $('#data-template'), resp.data);
    });
}

$(document).ready(() => {
    const drag = $("#shop-card");
    drag.bind("mousedown", function (evt) {
        const offset_x = $(this)[0].offsetLeft;
        const offset_y = $(this)[0].offsetTop;
        const mouse_x = evt.pageX, mouse_y = evt.pageY;
        $(document).bind("mousemove", function (ev) {
            const _x = ev.pageX - mouse_x;
            const _y = ev.pageY - mouse_y;
            const now_x = (offset_x + _x) + "px";
            const now_y = (offset_y + _y) + "px";
            drag.css({top: now_y, left: now_x});
        });
    });
    $(document).bind("mouseup", function () {
        $(this).unbind("mousemove");
    });
    $('#commit').click(commit_an_order);
    $('#dish-edit').click(change_dish_info);
    $('#dish-modal').on('show.bs.modal', (evt) => $('#dish-edit-id').val($(evt.relatedTarget).attr('id')));
    pager = paginator.create($('.pagination'));
    pager.change(load_dish);
    locator.change(() => $('#locator-addr').text(locator.address()));
    default_lng !== undefined ? locator.create(default_lng, default_lat) : locator.create();
    $('#header-search-button,#price,#sales').click(load_dish);
    load_dish();
});