function showProductInfo(productId) {
    var infoDiv = document.getElementById('product-info-' + productId);
    if (infoDiv.style.display === 'none') {
      infoDiv.style.display = 'block';
    } else {
      infoDiv.style.display = 'none';
    }
  }

