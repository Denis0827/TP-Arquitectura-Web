using Microsoft.AspNetCore.Mvc;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("API is running!");
        }
    }
} 