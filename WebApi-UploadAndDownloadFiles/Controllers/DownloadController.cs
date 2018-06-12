using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using WebApi_UploadAndDownloadFiles.Repository;

namespace WebApi_UploadAndDownloadFiles.Controllers
{
    public class DownloadController : ApiController
    {
        //File Download By Converting Base64 Format
        [HttpGet]
        [Route("api/Download/DirectDownloadFile")]
        public HttpResponseMessage DirectDownload(int FileId)
        {
            try
            {
                DownloadRepository downloadRepo = new DownloadRepository();
                HttpResponseMessage result = downloadRepo.DirectDownloadFromBase64(FileId);
                return result;
            }
            catch (Exception ex)
            {
                return this.Request.CreateResponse(HttpStatusCode.InternalServerError, ex);
            }
        }

     
    }
}
