let digimons = [];
let atual = 0;

const inicio = document.getElementById("inicio");
const resultado = document.getElementById("resultado");

const campoPesquisa = document.getElementById("campoPesquisa");
const btnPesquisar = document.getElementById("btnPesquisar");
const btnVoltar = document.getElementById("btnVoltar");

const mensagemErro = document.getElementById("mensagemErro");


// buscar um digimon

async function buscarDigimon(nome) {

    try {

        mensagemErro.textContent = "Pesquisando...";

        const resposta = await fetch(
            `https://digi-api.com/api/v1/digimon/${encodeURIComponent(nome)}`
        );

        if (!resposta.ok) {
            throw new Error("Digimon não encontrado");
        }

        const digimon = await resposta.json();

        mensagemErro.textContent = "";

        return digimon;

    } catch (erro) {

        mensagemErro.textContent =
            "Digimon não encontrado. Tente outro nome.";

        return null;
    }
}


function mostrarDigimon(digimon) {

    // imagem
    document.getElementById("imagemDigimon").src =
        digimon.images && digimon.images.length > 0
            ? digimon.images[0].href
            : "";

    document.getElementById("imagemDigimon").alt =
        "Imagem do " + digimon.name;


    // id
    document.getElementById("idDigimon").textContent =
        "ID: #" + String(digimon.id).padStart(3, "0");


    // nome
    document.getElementById("nomeDigimon").textContent =
        digimon.name;


    // descrição
    document.getElementById("descricaoDigimon").textContent =
        digimon.descriptions &&
        digimon.descriptions.length > 0
            ? digimon.descriptions[0].description
            : "Descrição não disponível.";


    // tipo
    if (digimon.types && digimon.types.length > 0) {

        document.getElementById("tipoDigimon").textContent =
            digimon.types[0].type;

    } else {

        document.getElementById("tipoDigimon").textContent =
            "Não informado";
    }


    // areas
    if (digimon.fields && digimon.fields.length > 0) {

        document.getElementById("areasDigimon").textContent =
            digimon.fields.map(campo => campo.field).join(", ");

    } else {

        document.getElementById("areasDigimon").textContent =
            "Não informado";
    }


    // nivel
    if (digimon.levels && digimon.levels.length > 0) {

        document.getElementById("nivelDigimon").textContent =
            digimon.levels[0].level;

    } else {

        document.getElementById("nivelDigimon").textContent =
            "Não informado";
    }


    // habilidades

    if (digimon.skills && digimon.skills.length > 0) {

        document.getElementById("habilidade1").textContent =
            digimon.skills[0].skill;

        document.getElementById("descHabilidade1").textContent =
            digimon.skills[0].description ||
            "Descrição não disponível.";

    } else {

        document.getElementById("habilidade1").textContent =
            "Não informado";

        document.getElementById("descHabilidade1").textContent =
            "";
    }


    if (digimon.skills && digimon.skills.length > 1) {

        document.getElementById("habilidade2").textContent =
            digimon.skills[1].skill;

        document.getElementById("descHabilidade2").textContent =
            digimon.skills[1].description ||
            "Descrição não disponível.";

    } else {

        document.getElementById("habilidade2").textContent =
            "Não informado";

        document.getElementById("descHabilidade2").textContent =
            "";
    }


    // contador

    document.getElementById("contador").textContent =
        "01 / 01";
}

// ABRIR RESULTADO

function abrirResultado(digimon) {

    inicio.style.display = "none";

    resultado.style.display = "block";

    mostrarDigimon(digimon);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// pesquisa

async function pesquisarDigimon() {

    const busca = campoPesquisa.value.trim();

    if (busca === "") {

        mensagemErro.textContent =
            "Digite o nome de um Digimon.";

        return;
    }


    const digimon = await buscarDigimon(busca);


    if (!digimon) {
        return;
    }


    digimons = [digimon];

    atual = 0;

    abrirResultado(digimon);
}

// botao de pesquisar

btnPesquisar.addEventListener(
    "click",
    pesquisarDigimon
);

// aperta enter

campoPesquisa.addEventListener(
    "keydown",
    function (evento) {

        if (evento.key === "Enter") {

            pesquisarDigimon();
        }
    }
);



// botao voltar

btnVoltar.addEventListener(
    "click",
    function () {

        resultado.style.display = "none";

        inicio.style.display = "block";

        campoPesquisa.value = "";

        mensagemErro.textContent = "";

        digimons = [];

        atual = 0;
    }
);

// mostrar todos os digimons

const btnVerTodos = document.getElementById("btnVerTodos");
const listaDigimons = document.getElementById("listaDigimons");
const btnVoltarLista = document.getElementById("btnVoltarLista");
const gradeDigimons = document.getElementById("gradeDigimons");
const totalDigimons = document.getElementById("totalDigimons");

async function buscarTodosDigimons() {

    try {

        totalDigimons.textContent = "Carregando Digimons...";

        gradeDigimons.innerHTML = "";

        const resposta = await fetch(
            "https://digi-api.com/api/v1/digimon?pageSize=100"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao carregar Digimons");
        }

        const dados = await resposta.json();

        mostrarTodosDigimons(dados.content);

        totalDigimons.textContent =
            dados.content.length + " Digimons encontrados";

    } catch (erro) {

        totalDigimons.textContent =
            "Não foi possível carregar os Digimons. Tente novamente.";

    }
}

function mostrarTodosDigimons(lista) {

    gradeDigimons.innerHTML = "";

    lista.forEach(function(digimon) {

        const card = document.createElement("div");

        card.classList.add("item-digimon");

        const imagem = document.createElement("img");

        imagem.src = digimon.image;
        imagem.alt = digimon.name;
        imagem.loading = "lazy";

        const nome = document.createElement("p");

        nome.textContent = digimon.name;

        card.appendChild(imagem);
        card.appendChild(nome);

        gradeDigimons.appendChild(card);

    });

}

btnVerTodos.addEventListener("click", function() {

    inicio.style.display = "none";

    resultado.style.display = "none";

    listaDigimons.style.display = "block";

    buscarTodosDigimons();

});

btnVoltarLista.addEventListener("click", function() {

    listaDigimons.style.display = "none";

    inicio.style.display = "block";

});