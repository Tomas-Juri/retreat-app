using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using TesseractOCR;

namespace RetreatAppApi.Controllers;

[ApiController]
[Route("[controller]")]
public class OcrController : ControllerBase
{
    [HttpGet]
    public object Get()
    {
        using var engine = new Engine(@"./tessdata", TesseractOCR.Enums.Language.Czech, TesseractOCR.Enums.EngineMode.Default);
        using var image = TesseractOCR.Pix.Image.LoadFromFile(@"./tessdata/index.jpg");
        var page = engine.Process(image);

        return new
        {
            page.MeanConfidence,
            page.Text
        };
    }
}