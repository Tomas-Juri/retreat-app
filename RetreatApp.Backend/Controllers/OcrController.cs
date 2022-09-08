using Microsoft.AspNetCore.Mvc;
using Tesseract;

namespace RetreatAppApi.Controllers;

[ApiController]
[Route("[controller]")]
public class OcrController : ControllerBase
{
	[HttpGet]
	public string Get()
	{
		using var engine = new TesseractEngine(@"./tessdata", "eng", EngineMode.Default);
		using var image = Pix.LoadFromFile(@"./tessdata/index.png");
		var page = engine.Process(image);

		return page.GetMeanConfidence() + ":" +  page.GetText();
	}
}