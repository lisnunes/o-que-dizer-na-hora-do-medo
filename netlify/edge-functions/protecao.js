export default async (request, context) => {
  const url = new URL(request.url);
  const cookies = request.headers.get("cookie") || "";

  // 1. Verifica se o navegador já possui o "carimbo" de acesso liberado
  const temCarimboAcesso = cookies.includes("oquedizer_autorizado=true");

  // 2. Verifica se a URL traz a chave secreta
  const chaveAcesso = url.searchParams.get("acesso");
  const chaveValida = chaveAcesso === "cakto" || chaveAcesso === "kiwify";

  // Se a pessoa já tem o carimbo, navega pelo site normalmente
  if (temCarimboAcesso) {
    return context.next();
  }

  // Se não tem o carimbo, mas veio com a chave certa no link:
  if (chaveValida) {
    // Remove a chave da URL para "limpar" a barra de endereço do aluno
    url.searchParams.delete("acesso");

    // Criamos a resposta 302 (redirecionamento) manualmente para não travar os cabeçalhos
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        "Set-Cookie":
          "oquedizer_autorizado=true; Path=/; SameSite=Lax; HttpOnly",
      },
    });
  }

  // Se não tem carimbo nem chave válida, bloqueia!
  return new Response(
    "Acesso Negado: Este produto só pode ser acessado de dentro da Área de Membros oficial.",
    {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
};
