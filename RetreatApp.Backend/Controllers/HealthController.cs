using Microsoft.AspNetCore.Mvc;

namespace RetreatAppApi.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public string Get() => "Healthy";
}