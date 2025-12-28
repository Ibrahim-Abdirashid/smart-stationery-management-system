using Microsoft.AspNetCore.Mvc;
using StationeryApi.Models;
using StationeryApi.Services;
using Microsoft.AspNetCore.Authorization;

namespace StationeryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;

    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var token = await _userService.LoginAsync(loginDto.Username, loginDto.Password);
        
        if (token == null)
            return Unauthorized("Invalid username or password");

        return Ok(new { Token = token, Username = loginDto.Username });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user)
    {
        // For simple demo, we let anyone register? 
        // Or we should restrict this? 
        // Requirement says "Owner creates Staff". 
        // Initial setup: We might need to allow creating the FIRST owner manually or via seed.
        // For now, let's open it but we will use "create-staff" for the specific requirement.
        
        var createdUser = await _userService.RegisterAsync(user);
        if (createdUser == null)
            return Conflict("Username already exists");

        return CreatedAtAction(nameof(Login), new { username = user.Username }, createdUser);
    }

    [Authorize(Roles = "Owner")]
    [HttpPost("create-staff")]
    public async Task<IActionResult> CreateStaff([FromBody] User staffUser)
    {
        staffUser.Role = "Staff"; // Enforce role
        var createdUser = await _userService.RegisterAsync(staffUser);
        
        if (createdUser == null)
            return Conflict("Username already exists");

        return Ok(new { Message = "Staff created successfully", Username = createdUser.Username });
    }
}

public class LoginDto
{
    public string Username { get; set; }
    public string Password { get; set; }
}
