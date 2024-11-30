import mercadopago
from flask import Flask, request, jsonify, redirect

app = Flask(__name__)

# Configura Mercado Pago con tus credenciales
mp = mercadopago.MP("TU_CLIENT_ID", "TU_CLIENT_SECRET")

# Ruta para procesar el pago
@app.route('/procesar_pago', methods=['POST'])
def procesar_pago():
    data = request.get_json()

    # Recuperamos el carrito y total
    cart = data.get('cart')
    total = data.get('total')

    # Creamos un objeto de pago de Mercado Pago
    preference_data = {
        "items": [],
        "back_urls": {
            "success": "http://127.0.0.1:5000/success",  # Cambia estas URLs a las correctas
            "failure": "http://127.0.0.1:5000/failure",
            "pending": "http://127.0.0.1:5000/pending"
        },
        "auto_return": "approved"
    }

    # Llenamos los productos del carrito en la preferencia
    for item in cart:
        preference_data["items"].append({
            "title": item['name'],
            "quantity": item['quantity'],
            "unit_price": item['price']
        })

    # Creamos la preferencia de pago
    preference_response = mp.create_preference(preference_data)

    if preference_response["status"] == 201:
        # Devolvemos la URL de pago de Mercado Pago
        return jsonify({
            'success': True,
            'payment_url': preference_response['response']['init_point']
        })
    else:
        return jsonify({'success': False}), 400

# Ruta para cuando el pago es exitoso
@app.route('/success')
def success():
    return "Pago exitoso"

# Ruta para cuando el pago falla
@app.route('/failure')
def failure():
    return "Pago fallido"

# Ruta para cuando el pago está pendiente
@app.route('/pending')
def pending():
    return "Pago pendiente"

if __name__ == "__main__":
    # Inicia la aplicación en modo debug
    app.run(debug=True)
