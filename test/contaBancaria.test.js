const ContaBancaria = require("../src/contaBancaria");

describe("contaBancaria", () => {
  let conta;
  let contaBancaria;

  beforeEach(() => {
    conta = {
      id: 1,
      titular: "João",
      saldo: 100,
      limite: 50,
      status: "ativa",
      atualizadaEm: new Date(),
    };

    contaBancaria = new ContaBancaria(conta);
  });

  test("deve obter saldo corretamente", () => {
    expect(contaBancaria.obterSaldo()).toBe(100);
  });

  test("deve depositar valor válido", () => {
    const resultado = contaBancaria.depositar(50);

    expect(resultado).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(150);
  });

  test("não deve depositar valor inválido", () => {
    const resultado = contaBancaria.depositar(-10);

    expect(resultado).toBe(false);
  });

  test("deve sacar valor dentro do limite", () => {
    const resultado = contaBancaria.sacar(120);

    expect(resultado).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(-20);
  });

  test("não deve sacar valor acima do limite", () => {
    const resultado = contaBancaria.sacar(200);

    expect(resultado).toBe(false);
  });

  test("deve bloquear conta", () => {
    contaBancaria.bloquearConta();

    expect(contaBancaria.obterStatus()).toBe("bloqueada");
  });

  test("deve ativar conta", () => {
    contaBancaria.bloquearConta();
    contaBancaria.ativarConta();

    expect(contaBancaria.obterStatus()).toBe("ativa");
  });

  test("não deve encerrar conta com saldo diferente de zero", () => {
    const resultado = contaBancaria.encerrarConta();

    expect(resultado).toBe(false);
  });

  test("deve encerrar conta com saldo zero", () => {
    contaBancaria.sacar(100); // saldo vira 0
    const resultado = contaBancaria.encerrarConta();

    expect(resultado).toBe(true);
    expect(contaBancaria.obterStatus()).toBe("encerrada");
  });

  test("deve transferir valor entre contas", () => {
    const contaDestino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 0,
      limite: 0,
      status: "ativa",
      atualizadaEm: new Date(),
    });

    const resultado = contaBancaria.transferir(50, contaDestino);

    expect(resultado).toBe(true);
    expect(contaBancaria.obterSaldo()).toBe(50);
    expect(contaDestino.obterSaldo()).toBe(50);
  });

  test("não deve transferir se saldo insuficiente", () => {
    const contaDestino = new ContaBancaria({
      id: 2,
      titular: "Maria",
      saldo: 0,
      limite: 0,
      status: "ativa",
      atualizadaEm: new Date(),
    });

    const resultado = contaBancaria.transferir(500, contaDestino);

    expect(resultado).toBe(false);
  });

  test("deve validar conta corretamente", () => {
    expect(contaBancaria.validarConta()).toBe(true);
  });

  test("deve detectar conta inválida", () => {
    const contaInvalida = new ContaBancaria({
      saldo: "100",
      limite: -10,
      status: "qualquer",
    });

    expect(contaInvalida.validarConta()).toBe(false);
  });

  test("deve resetar conta", () => {
    contaBancaria.resetarConta();

    expect(contaBancaria.obterSaldo()).toBe(0);
    expect(contaBancaria.obterLimite()).toBe(0);
    expect(contaBancaria.obterStatus()).toBe("ativa");
  });

  test("deve gerar resumo corretamente", () => {
    const resumo = contaBancaria.gerarResumo();

    expect(resumo).toEqual({
      titular: "João",
      saldo: 100,
      limite: 50,
      disponivel: 150,
      status: "ativa",
    });
  });
});