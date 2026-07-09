// offers.js - lets user click a coupon code to copy it

function copyCode(code) {
    navigator.clipboard.writeText(code).then(function () {
        alert('Coupon code "' + code + '" copied!');
    }).catch(function () {
        alert('Could not copy code. Please copy it manually: ' + code);
    });
}
