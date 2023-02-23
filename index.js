const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

/* 
    - Query params => meusite.com/users?nome=rodolfo&age=28 //FILTROS
    - Route params => /users/2      // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFICO
    - Request Body => {"name":"Rodolfo", "age":}

    -> GET - Leitura
    -> POST - Criação
    -> PUT - Atualização
    -> DELETE - Deleção
    -> PATCH - Atualização Parcial

    - Middleware => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
 */

const users = [];

const checkUserId = (request, response, next) => {
    const { id } = request.params;

    const index = users.findIndex((user) => user.id === id);
    if (index < 0) {
        return response.status(404).json({ error: "User not found" });
    }

    request.userIndex = index;
    request.userId = id;
    next();
};

app.get("/users", (request, response) => {
    console.log("A rota foi chamada");

    return response.send(users);
});

app.post("/users", (request, response) => {
    try {
        const { name, age } = request.body;
        const user = { id: uuid.v4(), name, age };

        if (age < 18) throw new Error("Only allowed users over 18 years old");

        users.push(user);

        return response.status(201).send(user);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    } finally {
        console.log("Finalizando");
    }
});

app.put("/users/:id", checkUserId, (request, response) => {
    const { name, age } = request.body;
    const index = request.userIndex;
    const id = request.userId;
    const updatedUser = { id, name, age };
    console.log(request);

    users[index] = updatedUser;

    return response.send(updatedUser);
});

app.delete("/users/:id", checkUserId, (request, response) => {
    const index = request.userIndex;

    users.splice(index, 1);

    return response.status(204).json();
});

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});
