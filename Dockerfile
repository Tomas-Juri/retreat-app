FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Install libs for Tesseract
RUN apt-get update
RUN apt-get install -y git cmake build-essential
RUN mkdir leptonica
RUN git clone https://github.com/DanBloomberg/leptonica.git /leptonica

WORKDIR /leptonica
RUN mkdir build
WORKDIR /leptonica/build
RUN cmake ..

RUN apt-get install -y libleptonica-dev libtesseract-dev

# Link libs for Tesseract
WORKDIR /app/x64
RUN ln -s /usr/lib/x86_64-linux-gnu/liblept.so.5 libleptonica-1.80.0.so
RUN ln -s /usr/lib/x86_64-linux-gnu/libtesseract.so.4.0.1 libtesseract41.so

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["RetreatApp.Backend/RetreatAppApi.csproj", "RetreatApp.Backend/"]
RUN dotnet restore "RetreatApp.Backend/RetreatAppApi.csproj"
COPY . .

WORKDIR "/src/RetreatApp.Backend"
RUN dotnet build "RetreatAppApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "RetreatAppApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RetreatAppApi.dll"]