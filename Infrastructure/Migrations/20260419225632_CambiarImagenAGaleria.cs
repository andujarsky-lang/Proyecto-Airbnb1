using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CambiarImagenAGaleria : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlImagen",
                table: "Propiedades");

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "ImagenesPropiedad",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "ImagenesPropiedad",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ImagenesPropiedad_PropiedadId",
                table: "ImagenesPropiedad",
                column: "PropiedadId");

            migrationBuilder.AddForeignKey(
                name: "FK_ImagenesPropiedad_Propiedades_PropiedadId",
                table: "ImagenesPropiedad",
                column: "PropiedadId",
                principalTable: "Propiedades",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImagenesPropiedad_Propiedades_PropiedadId",
                table: "ImagenesPropiedad");

            migrationBuilder.DropIndex(
                name: "IX_ImagenesPropiedad_PropiedadId",
                table: "ImagenesPropiedad");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "ImagenesPropiedad");

            migrationBuilder.AddColumn<string>(
                name: "UrlImagen",
                table: "Propiedades",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "ImagenesPropiedad",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
