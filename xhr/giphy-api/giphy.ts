"use strict";

class GIPHY {
  public API_URL: string;
  private readonly API_KEY: string;
  private myRequest: XMLHttpRequest;
  private myGIF: HTMLElement;
  public limitGIF: number;

  constructor(API_URL: string, myGIF: HTMLElement, limitGIF: number) {
    this.API_URL = API_URL;
    this.API_KEY = "vtAtAQfLZXRy6YbSA8EPnPzwfwtRvbcQ";
    this.myRequest = new XMLHttpRequest();
    this.myGIF = myGIF;
    this.limitGIF = limitGIF;
  }

  public load(): void {
    this.myRequest.onload = () => {
      if (this.myRequest.status === 200) {
        const myResponse: any = JSON.parse(this.myRequest.responseText);

        myResponse.data.forEach(e => {
          const GIF: HTMLImageElement = document.createElement("img");
          GIF.setAttribute("src", e.images.fixed_width_small_still.url);
          this.myGIF.appendChild(GIF);
          GIF.onclick = () => {
            GIF.setAttribute("src", e.images.fixed_width_small.url);
          };
        });
      }
    };
  }

  public open(): void {
    this.myRequest.open(
      "GET",
      `${this.API_URL}?api_key=${this.API_KEY}&q=random&limit=${this.limitGIF}`
    );
  }

  public send(): void {
    this.myRequest.send();
  }
}

const GIFGenerator: GIPHY = new GIPHY(
  "https://api.giphy.com/v1/gifs/search",
  document.getElementById("gif-container"),
  16
);
GIFGenerator.load();
GIFGenerator.open();
GIFGenerator.send();