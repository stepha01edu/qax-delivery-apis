# Mission. -- WIP -- ESTA ENTREGA DEL DIA DE HOY 5 DE JUNION, ES PRE-LIMINAR PARA LOGRAR ACTIVAR EL WARMUP DEL STAGE 2 Y ASI APROVECHAR LA MENTORIA DEL SABADO 6 DE JUNIO.

# Entrega: Smoke E2E - Plataforma Bancaria

## ¿Qué es?

Ejercicio end-to-end con varios casos de prueba para validar los flujos principales de una plataforma bancaria.  
Forma parte del Stage_1 de la mentoría.

---

## Objetivo / Historia de usuario

El objetivo de esta entrega es validar un flujo Smoke E2E que permita confirmar que las funcionalidades críticas de la plataforma bancaria funcionan correctamente.

### Historias de usuario cubiertas

**Módulo 1: Resumen de Cuentas y Movimientos**

Como cliente del banco,  
quiero consultar el resumen de mi perfil, mis cuentas bancarias y mis últimos movimientos,  
para llevar un control diario de mi dinero y mis finanzas personales.

**Módulo 2: Transferencias y Pago de Servicios**

Como cliente del banco,  
quiero transferir dinero a otras cuentas y pagar mis servicios desde la plataforma,  
para cumplir con mis obligaciones financieras sin tener que ir a una sucursal física.

**Módulo 3: Gestión de Productos Financieros**

Como cliente del banco,  
quiero gestionar mis tarjetas, solicitar préstamos personales y crear inversiones,  
para administrar mis herramientas de crédito y hacer crecer mis ahorros.

**Módulo 4: Administración del Sistema para QA**

Como administrador del sistema QA,  
quiero poder restablecer la base de datos a su estado original,  
para asegurar que mis pruebas diarias comiencen siempre con los mismos saldos y productos.

---

## Criterios de aceptación

- El cliente debe poder visualizar su perfil, sus cuentas bancarias y sus últimos movimientos.
- El cliente debe poder transferir dinero si tiene saldo suficiente.
- El sistema debe bloquear una transferencia cuando el saldo sea insuficiente.
- El cliente debe poder pagar servicios desde la plataforma.
- El cliente debe poder solicitar préstamos, crear inversiones y gestionar tarjetas.
- El cliente debe poder cancelar productos financieros creados previamente.
- El administrador QA debe poder restablecer la base de datos a su estado inicial.

---

## Estrategia de prueba

La estrategia consiste en ejecutar una suite Smoke E2E, enfocada en validar los flujos principales del sistema.

Se priorizan los escenarios críticos y felices del negocio, junto con una validación básica de regla de negocio para fondos insuficientes.

### Precondiciones

- El ambiente de pruebas está disponible.
- El cliente de prueba existe y puede iniciar sesión.
- El cliente tiene cuentas activas.
- El cliente cuenta con saldo suficiente para realizar operaciones principales.
- El administrador QA puede ejecutar el reset de datos.

---

## Casos de prueba E2E Smoke en Gherkin

```gherkin
Feature: Smoke E2E - Plataforma bancaria

  Como equipo QA
  Quiero validar los flujos principales de la plataforma bancaria
  Para confirmar que las funcionalidades críticas están operativas

  Background:
    Given que la base de datos fue restablecida a su estado inicial
    And el cliente de prueba inició sesión correctamente en la plataforma

  @Smoke @E2E
  Scenario: CP01 - Iniciar sesión correctamente
    When el cliente envía una petición POST al endpoint /auth/login con credenciales válidas
    Then debe obtener un token de autenticación válido

  @Smoke @E2E
  Scenario: CP02 - Visualizar dashboard del cliente
    Given que el cliente está autenticado
    When consulta el endpoint GET /cliente/dashboard
    Then debe visualizar un saludo de bienvenida
    And debe visualizar la información personal de su perfil

  @Smoke @E2E
  Scenario: CP03 - Consultar cuentas y movimientos
    Given que el cliente está autenticado
    When consulta el endpoint GET /cuentas/
    Then debe visualizar sus cuentas con saldo disponible y moneda
    When consulta el endpoint GET /transacciones/
    Then debe visualizar movimientos con fecha, monto y concepto

  @Smoke @E2E
  Scenario: CP04 - Realizar transferencia con saldo suficiente
    Given que el cliente tiene saldo suficiente en la cuenta origen
    When envía una petición POST al endpoint /transferencias/
    And ingresa una cuenta destino válida y un monto permitido
    Then la transferencia debe procesarse correctamente
    And debe generarse un comprobante de la operación

  @Smoke @E2E
  Scenario: CP05 - Bloquear transferencia por fondos insuficientes
    Given que el cliente está autenticado
    When envía una petición POST al endpoint /transferencias/
    And ingresa un monto mayor al saldo disponible
    Then el sistema debe bloquear la operación
    And debe informar que no posee fondos suficientes

  @Smoke @E2E
  Scenario: CP06 - Registrar pago de servicio
    Given que el cliente tiene saldo suficiente
    When envía una petición POST al endpoint /pagos/servicios
    Then el pago debe registrarse correctamente
    And el monto debe descontarse de la cuenta seleccionada

  @Smoke @E2E
  Scenario: CP07 - Gestionar préstamo
    Given que el cliente está autenticado
    When envía una petición POST al endpoint /prestamos/ con un monto válido
    Then el préstamo debe quedar registrado con un identificador único
    When consulta el endpoint GET /prestamos/
    Then el préstamo creado debe aparecer en el listado
    When envía una petición DELETE al endpoint /prestamos/{loan_id}/desistir
    Then el préstamo no debe aparecer como activo

  @Smoke @E2E
  Scenario: CP08 - Gestionar plazo fijo
    Given que el cliente tiene fondos disponibles para invertir
    When envía una petición POST al endpoint /plazos-fijos/
    Then el sistema debe confirmar la creación del plazo fijo
    When consulta el endpoint GET /plazos-fijos/
    Then el plazo fijo creado debe aparecer en el listado
    When envía una petición DELETE al endpoint /plazos-fijos/{id}
    Then el plazo fijo no debe aparecer como activo

  @Smoke @E2E
  Scenario: CP09 - Gestionar tarjeta
    Given que el cliente está autenticado
    When consulta el endpoint GET /tarjetas/
    Then debe visualizar sus tarjetas actuales
    When envía una petición POST al endpoint /tarjetas/
    Then la nueva tarjeta debe generarse correctamente
    When envía una petición DELETE al endpoint /tarjetas/{card_id}
    Then la tarjeta seleccionada debe quedar eliminada o inactiva

  @Smoke @E2E
  Scenario: CP10 - Restablecer datos del sistema
    When el administrador QA envía una petición POST al endpoint /sistema/resetear
    Then las cuentas, tarjetas y saldos deben restaurarse a sus valores iniciales