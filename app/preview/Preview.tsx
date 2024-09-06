import type { BaseContext } from "deco/engine/core/resolver.ts";
import type { AppRuntime } from "deco/types.ts";
import type { JSX } from "preact";
import type { App } from "../mod.ts";

export function Preview(
  app: AppRuntime<BaseContext, App["state"]> & {
    markdownContent: () => JSX.Element;
  },
) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .box-container {
              background: hsl(228, 7%, 15%);
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .box {
              margin: auto;
              background: hsl(223 6.7% 20.6% / 1);
              width: 480px;
              padding: 32px;
              font-size: 18px;
              box-shadow: 0 2px 10px 0 hsl(0 0% 0% / 0.2);;
              border-radius: 5px;
              box-sizing: border-box;
              color: hsl(214 8.1% 61.2% / 1);
              font-size: 16px;
              line-height: 1.25;
              font-weight: 400;
            }

            .wrapper {
              width: 100%;
              text-align: center;
            }

            .heading {
              margin-bottom: 8px;
              color: hsl(220 13% 95.5% / 1);;
              font-size: 24px;
              line-height: 1.25;
              font-weight: 600;
            }

            .button {
              color: hsl(0 0% 100% / 1);
              background-color: hsl(235 85.6% 64.7% / 1);
              font-size: 16px;
              line-height: 24px;
              margin-top: 24px;
              width: 100%;
              min-width: 120px;
              min-height: 40px;
              transition: all 0.2s ease-in-out;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 3px;
              font-weight: 500;
              line-height: 16px;
              padding: 2px 16px;
            }
        `,
        }}
      />
      <div class="box-container">
        <section class="box">
          <div class="wrapper">
            <h1 class="heading">
              Configurando o App
            </h1>
            <div>
              Para configurar o app corretamente, é necessário algumas
              informações, como o token do Github para ações no pull request, e
              o token do Discord para enviar mensagens e responder comandos.
            </div>
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=Deco%20App%20Token"
              class="button"
            >
              Obter token do Github
            </a>
            {app.state.discord.token
              ? (
                <button style={{ backgroundColor: "#3ba55c" }} class="button">
                  Token do Discord configurado
                </button>
              )
              : (
                <a
                  href="https://discord.com/developers/applications"
                  class="button"
                >
                  Obter token do Discord
                </a>
              )}
            <a
              href={`https://discord.com/oauth2/authorize?client_id=${app.state.discord.bot.id}&scope=bot&permissions=8`}
              class="button"
            >
              Convidar para o meu Discord
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
