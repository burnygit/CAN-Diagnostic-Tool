﻿
using CanDiagnosticTool.Server;
using Ixxat.Vci4;
using Ixxat.Vci4.Bal;
using Ixxat.Vci4.Bal.Can;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Rejestracja CanService w kontenerze DI
builder.Services.AddSingleton<ICanService, CanService>();
// Rejestracja WebSocketHandler
builder.Services.AddSingleton<WebSocketHandler>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dodanie Cors poniewaz Front-end i Back-end są na innych portach (zapobiega ewentualnemu blokowaniu WS)
// [!] Zmienic metody buldera na okreslony adres URL / okreslone metody HTTP itd.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowAllOrigins");

//Obsługa WebSocket
var options = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2) //Opcjonalnie dla stabilnosci [moze usunac w przyszlosci]
};
app.UseWebSockets(options);

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws/can")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            Console.WriteLine("ws/can connected");
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            // Pobierz handler z DI
            var handler = context.RequestServices.GetRequiredService<WebSocketHandler>();
            await handler.HandleReceive(webSocket);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
    else
    {
        await next();
    }
});

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws/canSend")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            Console.WriteLine("ws/canSend connected");
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            // Pobierz handler z DI
            var handler = context.RequestServices.GetRequiredService<WebSocketHandler>();
            await handler.HandleSend(webSocket);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
    else
    {
        await next();
    }
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
