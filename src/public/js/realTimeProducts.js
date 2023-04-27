const socket = io()

socket.on('products', (data) =>{
    console.log(data)
    let logs=''
    let div = document.getElementById('realProdSect')

    data.forEach(p => {
        logs += `   <article>
                    <h3>${p.title}</h3>
                    <span>ID: ${p.id}</span>
                    <span>Categoría: ${p.category}</span>
                    <p>Descripción: ${p.description}</p>
                    <span>Precio: $ ${p.price}</span>
                    <span>Stock: ${p.stock}</span>
                    <span>Código: ${p.code}</span>
                    </article> <hr>`
    });

    div.innerHTML=logs
})