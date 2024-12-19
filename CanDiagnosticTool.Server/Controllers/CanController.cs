namespace CanDiagnosticTool.Server.Controllers
{
    using Ixxat.Vci4.Bal.Can;
    using Microsoft.AspNetCore.Mvc;

    public class CanController: ControllerBase
    {
        private readonly ICanService _canService;

        public CanController(ICanService canService)
        {
            _canService = canService;
        }

    }
}
