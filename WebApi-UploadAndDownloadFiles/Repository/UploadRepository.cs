using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using WebApi_UploadAndDownloadFiles.Models;

namespace WebApi_UploadAndDownloadFiles.Repository
{
    public class UploadRepository
    {
        public async Task<List<FileData>> GetData()
        {
            using (FileEntities db = new FileEntities())
            {
                var fileData = db.FileDatas.Select(x => x).ToList();
                return await Task.FromResult(fileData);
            }
        }
        public async Task<string> UploadFileToDB(List<UploadFilesList> uploadfiles)
        {
            using (FileEntities db = new FileEntities())
            {
                for (int i = 0; i < uploadfiles.Count(); i++)
                {
                    FileData fileData = new FileData()
                    {
                        File = uploadfiles[i].File,
                        FileDescription = uploadfiles[i].FileDescription,
                        FileName = uploadfiles[i].FileName,
                        FileType= uploadfiles[i].FileType
                    };
                    db.FileDatas.Add(fileData);
                }
                db.SaveChanges();
            }
            return await Task.FromResult("Saved Successfully");
        }
    }
}