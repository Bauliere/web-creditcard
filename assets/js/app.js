/* ============================================================
   JAVASCRIPT MÍNIMO — Solo funcionalidad que CSS no puede lograr
   ============================================================
   Autor: Santana Santanita | 2077 Empresa SA

   Este archivo contiene SOLO lo necesario:
   1. Reflejo de datos en tiempo real en la tarjeta
   2. Formateo del número de tarjeta (espacios cada 4 dígitos)
   3. Detección del tipo de tarjeta (Visa/MC/Amex/Discover)
   4. Flip de la tarjeta al enfocar CVV
   5. Efecto scroll en el navbar
   
   Todo lo demás (animaciones, hover, menú móvil, botón de
   redes sociales) se maneja con CSS puro.
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ── Referencias al DOM ── */
    var numInput   = document.getElementById('cardNumber');
    var nameInput  = document.getElementById('cardHolder');
    var monthSel   = document.getElementById('expMonth');
    var yearSel    = document.getElementById('expYear');
    var cvvInput   = document.getElementById('cvv');
    var cardFlip   = document.getElementById('cardFlip');
    var numDisplay = document.getElementById('cardNumberDisplay');
    var nameDisp   = document.getElementById('cardHolderDisplay');
    var expDisp    = document.getElementById('cardExpiryDisplay');
    var cvvDisp    = document.getElementById('cvvDisplay');
    var typeDisp   = document.getElementById('cardTypeDisplay');
    var typeIcon   = document.getElementById('cardTypeIcon');
    var groups     = numDisplay.querySelectorAll('.num-group');
    var nav        = document.querySelector('.glass-navbar');

    /* ============================================================
       FORMATEAR NÚMERO (espacios cada 4 dígitos)
       Para cambiar el separador → reemplaza ' ' por otro carácter
    ============================================================ */
    function formatNum(v) {
        var d = v.replace(/\D/g, '').slice(0, 16);
        return d.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    /* ============================================================
       DETECTAR TIPO DE TARJETA
       Para agregar más tipos → añade un bloque if con el patrón
    ============================================================ */
    function detectType(n) {
        var d = n.replace(/\D/g, '');
        if (/^4/.test(d))                             return { t: 'VISA',  i: 'bi-credit-card-2-front-fill' };
        if (/^(5[1-5]|22[2-9]|2[3-6]|27[01]|2720)/.test(d)) return { t: 'MC',    i: 'bi-credit-card-fill' };
        if (/^3[47]/.test(d))                         return { t: 'AMEX',  i: 'bi-credit-card-2-back-fill' };
        if (/^(6011|65)/.test(d))                     return { t: 'DISC',  i: 'bi-credit-card-fill' };
        return { t: 'VISA', i: 'bi-credit-card' };
    }

    /* ============================================================
       ACTUALIZAR NÚMERO EN LA TARJETA
       Cada grupo de 4 dígitos se actualiza individualmente.
       Si cambia, se aplica la animación CSS 'pop' (digitPop).
    ============================================================ */
    function updateNum(v) {
        var d = v.replace(/\D/g, '').padEnd(16, '#');
        for (var i = 0; i < 4; i++) {
            var g = d.slice(i * 4, i * 4 + 4);
            var s = groups[i];
            if (s.textContent !== g) {
                s.textContent = g;
                s.classList.remove('pop');
                void s.offsetWidth; /* Forzar reflow para reiniciar animación */
                s.classList.add('pop');
            }
        }
        var tp = detectType(v);
        if (typeDisp.textContent !== tp.t) {
            typeDisp.style.opacity = '0';
            setTimeout(function () { typeDisp.textContent = tp.t; typeDisp.style.opacity = '1'; }, 100);
        }
        typeIcon.innerHTML = '<i class="bi ' + tp.i + '"></i>';
    }

    /* ============================================================
       ACTUALIZAR NOMBRE DEL TITULAR
       Aplica animación CSS 'slide' (textSlide) al cambiar.
    ============================================================ */
    function updateName(v) {
        var d = v.trim() ? v.toUpperCase() : 'FULL NAME';
        if (nameDisp.textContent !== d) {
            nameDisp.textContent = d;
            nameDisp.classList.remove('slide');
            void nameDisp.offsetWidth;
            nameDisp.classList.add('slide');
        }
    }

    /* ============================================================
       ACTUALIZAR FECHA DE EXPIRACIÓN
    ============================================================ */
    function updateExp() {
        var m = monthSel.value || 'MM';
        var y = yearSel.value || 'YY';
        var d = m + '/' + y;
        if (expDisp.textContent !== d) {
            expDisp.textContent = d;
            expDisp.classList.remove('slide');
            void expDisp.offsetWidth;
            expDisp.classList.add('slide');
        }
    }

    /* ============================================================
       ACTUALIZAR CVV (asteriscos)
    ============================================================ */
    function updateCVV(v) {
        var d = v.replace(/\D/g, '');
        cvvDisp.textContent = d ? '*'.repeat(d.length) : '***';
    }

    /* ============================================================
       EVENT LISTENERS — Reflejan datos en tiempo real
    ============================================================ */
    numInput.addEventListener('input', function (e) {
        e.target.value = formatNum(e.target.value);
        updateNum(e.target.value);
    });

    nameInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '');
        updateName(e.target.value);
    });

    monthSel.addEventListener('change', updateExp);
    yearSel.addEventListener('change', updateExp);

    cvvInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '');
        updateCVV(e.target.value);
    });

    /* ============================================================
       FLIP DE LA TARJETA — Al enfocar CVV se gira al reverso
    ============================================================ */
    cvvInput.addEventListener('focus', function () { cardFlip.classList.add('flipped'); });
    cvvInput.addEventListener('blur', function () { cardFlip.classList.remove('flipped'); });
    [numInput, nameInput, monthSel, yearSel].forEach(function (el) {
        el.addEventListener('focus', function () { cardFlip.classList.remove('flipped'); });
    });

    /* ============================================================
       NAVBAR SCROLL — Oscurece el navbar al hacer scroll
       Para cambiar la distancia de activación → modifica 50
    ============================================================ */
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(26,10,16,0.9)';
            nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
        } else {
            nav.style.background = '';
            nav.style.boxShadow = '';
        }
    }, { passive: true });

    /* ============================================================
       VALIDACIÓN Y SUBMIT
       Validación básica con animación shake en campos inválidos.
    ============================================================ */
    document.getElementById('paymentForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var fields = [numInput, nameInput, monthSel, yearSel, cvvInput];

        fields.forEach(function (f) { f.classList.remove('is-invalid', 'shake'); });

        if (numInput.value.replace(/\D/g, '').length < 16) { mark(numInput); ok = false; }
        if (nameInput.value.trim().length < 2) { mark(nameInput); ok = false; }
        if (!monthSel.value) { mark(monthSel); ok = false; }
        if (!yearSel.value) { mark(yearSel); ok = false; }
        if (cvvInput.value.replace(/\D/g, '').length < 3) { mark(cvvInput); ok = false; }

        if (ok) {
            var btn = document.getElementById('btnPay');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            setTimeout(function () {
                btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Payment Successful!';
                btn.classList.add('success');
                setTimeout(function () {
                    btn.innerHTML = '<i class="bi bi-lock-fill me-2"></i>Pay Now';
                    btn.classList.remove('success');
                    btn.disabled = false;
                    btn.style.background = '';
                }, 3000);
            }, 2000);
        }
    });

    function mark(el) {
        el.classList.add('is-invalid', 'shake');
        setTimeout(function () { el.classList.remove('shake'); }, 500);
    }

}); /* Fin DOMContentLoaded */
