using Microsoft.AspNetCore.Mvc;

namespace MiApiHello.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HelloController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("¡Hola desde .NET API!");
        }
    }
}
