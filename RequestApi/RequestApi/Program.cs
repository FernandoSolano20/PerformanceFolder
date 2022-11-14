using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace RequestApi
{
    class Program
    {
        static async void Main(string[] args)
        {
            var urlList = new List<string[]>();
            using (var reader = new StreamReader(@"C:\Users\fersolano\Desktop\ProdLog\URLs.CSV"))
            {
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(';');
                    urlList.Add(values);
                }
            }

            var times = new List<Task<Tuple<HttpResponseMessage, TimeSpan>>>();

            foreach (var url in urlList)
            {
                var client = new HttpClient();
                var info = _GetHttpWithTimingInfo("http://api.newhomesource.com" + url[0] + "?" + url[2]);
                await Task.WhenAll(info);
                if (info.Result >  url[3])
                {

                }
            }
            
        }

        private static async Task<Tuple<HttpResponseMessage, TimeSpan>> _GetHttpWithTimingInfo(string url)
        {
            var stopWatch = Stopwatch.StartNew();
            using (var client = new HttpClient())
            {
                var result = await client.GetAsync(url);
                return new Tuple<HttpResponseMessage, TimeSpan>(result, stopWatch.Elapsed);
            }
        }
    }
}
