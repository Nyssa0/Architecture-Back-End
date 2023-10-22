window.addEventListener("DOMContentLoaded", function () {
    fetch("/users/get", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }

    })
        .then((res) => res.json())
        .then((users) => {
            document.getElementById("userList").innerHTML = users.map((user) => {
                return `
                <li id="${user._id}">
                        ID: ${user._id} <br> username: ${user.username} <br> email: ${user.email} <br> password: ${user.password} <br>
                <button onclick="updateUser()" type="button" data-id="${user._id}">Patch User</button>
                <button onclick="deleteUser()" type="button" data-id="${user._id}">Remove User</button>
                </li>
            `
            }).join("");
        })
}, false);

const addNewUser = () => {
    const newUser = prompt("User username & email & password (separated by a comma)");
    if (newUser) {
        const [username, email, password] = newUser.split(",");
        fetch("/users/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    document.getElementById("userList").innerHTML += `
                        <li id="${res._id}">
                            ID: ${res._id} <br> username: ${username} <br> email: ${email} <br> password: ${password}
                        </li>
                    `
                }
                window.location.reload();
            });
    }
};

const updateUser = () => {
    const userId = event.target.dataset.id;
    if (userId) {
        const newUser = prompt("User name & author (separated by a comma)");
        if (newUser) {
            const [username, email, password] = newUser.split(",");
            fetch(`/users/patch/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            })
                .then((res) => res.json())
                .then((res) => {
                    if (res.success) {
                        document.getElementById(userId).innerHTML = `
                        ID: ${_id} <br> username: ${username} <br> email: ${email} <br> password: ${password}
                        `;
                    }
                    window.location.reload();
                });
        }
    }
};

const deleteUser = () => {
    const userId = event.target.dataset.id
    if (userId) {
        fetch(`/users/delete/${userId}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    document.getElementById(userId).remove();
                }
                window.location.reload();
            });
    }
};