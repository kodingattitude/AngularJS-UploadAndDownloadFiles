using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using WebApi_UploadAndDownloadFiles.Models;
using WebApi_UploadAndDownloadFiles.Repository;

namespace WebApi_UploadAndDownloadFiles.Controllers
{
    public class UploadController : ApiController
    {

        [HttpPut]
        [Route("api/Upload/UploadFile")]
        public async Task<IHttpActionResult> UploadFileToDB(List<UploadFilesList> uploadfiles)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                UploadRepository uploadRepo = new UploadRepository();
                var result = await uploadRepo.UploadFileToDB(uploadfiles);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return null;
            }
           
            }
        
        [HttpGet]
        [Route("api/Upload/GetAllData")]
    public async Task<List<FileData>> GetAllData()
    {
        try
        {
            UploadRepository uploadRepo = new UploadRepository();
            var result = await uploadRepo.GetData();
            return result;
        }
        catch (Exception ex)
        {
            return null;
        }
    }
}
}
