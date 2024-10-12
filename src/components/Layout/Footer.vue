<template>
    <footer class="w-100 pt-3 mt-auto">
        <hr class="horizontal dark my-0" />
        <div class="container">
            <div class="footer-content">
                <p class="mb-0 larger copyright">&copy; 2024</p>
                <ul class="list-inline my-0">
                    <li class="list-inline-item"><RouterLink to="/">聯絡我們</RouterLink></li>
                    <li class="list-inline-item"><RouterLink to="/">常見問題</RouterLink></li>
                    <li class="list-inline-item"><RouterLink to="/">錯誤回報</RouterLink></li>
                </ul>
                <RouterLink class="navbar-brand font-weight-bolder" to="/">
                    <img src="@/assets/logo.svg" class="navbar-brand-img" alt="main_logo" />
                    <span class="ms-1 larger">RecipeCube</span>
                </RouterLink>
            </div>
        </div>
    </footer>
</template>

<script setup></script>

<style scoped>
footer {
    position: relative;
    bottom: 0;
    width: 100%;
    margin-top: auto;
    padding: 20px 0;
    color: #364868 !important;
}

.footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

footer ul {
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin: 0;
}

footer ul li {
    margin: 0 1.5rem;
    font-size: 120% !important;
}

footer ul li a {
    text-decoration: none;
    color: #364868;
    white-space: nowrap;
}

footer ul li a:hover {
    text-decoration: underline;
}

footer p {
    margin: 0;
}

footer span {
    font-size: 130% !important;
    color: #364868;
}

.navbar-brand-img {
    max-width: 40px;
}

.larger {
    font-size: 150% !important;
}

/* RWD */
@media (max-width: 768px) {
    .footer-content {
        flex-direction: column;
        text-align: center;
    }

    footer ul {
        flex-direction: column;
        align-items: center;
        margin: 15px 0;
    }

    footer ul li {
        margin: 10px 0;
    }

    .copyright {
        order: 3;
    }

    .navbar-brand {
        order: 1;
    }

    footer ul {
        order: 2;
    }
}

@media (max-width: 480px) {
    footer {
        padding: 15px 0;
    }

    .larger {
        font-size: 130% !important;
    }

    footer ul li {
        font-size: 110% !important;
    }

    .navbar-brand-img {
        max-width: 35px;
    }
}
</style>
